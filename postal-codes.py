import json
import geopandas as gpd
import requests
import shapely.geometry

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
OPENDATA_URL = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-germany-postleitzahl/records?select=plz_name%2C%20name&where=name%20%3D%20%22{0}%22&limit=10"

QUERY = """
[out:json];
area["ISO3166-1"="DE"]->.de;
(
  relation["boundary"="postal_code"](area.de);
);
out geom;
"""


def fetch_postal_code_data():
    """Queries the OSM Overpass API and returns the raw data."""
    response = requests.get(OVERPASS_URL, params={'data': QUERY})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error while fetching: {
                        response.status_code}")


def parse_postal_codes(data):
    """Parses the GeoJSON data and returns a GeoDataFrame with postal code polygons."""
    postal_codes = []
    geometries = []
    postal_code_names = []

    for i, element in enumerate(data['elements']):
        if i and i % 100 == 0:
            print(f"{i}/{len(data['elements'])} coordinates processed.")

        if 'tags' in element and 'postal_code' in element['tags']:
            tags = element['tags']
            postal_code = tags.get('postal_code')
            bounds = element.get('bounds')
            result = requests.get(OPENDATA_URL.format(
                postal_code)).json()["results"]
            if not result:
                continue
            c1 = bounds['minlat'], bounds['minlon']
            c2 = bounds['minlat'], bounds['maxlon']
            c3 = bounds['maxlat'], bounds['minlon']
            c4 = bounds['maxlat'], bounds['maxlon']
            coords = [c2, c3, c1, c4]
            polygon = shapely.geometry.Polygon(
                [(lon, lat) for lat, lon in coords])
            postal_codes.append(postal_code)
            geometries.append(polygon)
            postal_code_names.append(result[0]["plz_name"])
    return gpd.GeoDataFrame(
        # type:ignore
        {"postal_code": postal_codes, "geometry": geometries, "postal_code_name": postal_code_names}, crs="EPSG:4326")


def create_adjacency_list(postal_code_gdf):
    """Creates an adjacency list of neighboring / almost neighboring postal codes."""
    adjacency_list = {}

    for i, row in postal_code_gdf.iterrows():
        if i and i % 1000 == 0:
            print(f"{i}/{len(postal_code_gdf)} postal codes processed.")

        neighbors = postal_code_gdf[postal_code_gdf.geometry.touches(row.geometry) |
                                    postal_code_gdf.geometry.intersects(row.geometry)]
        neighbors_sorted = sorted(
            [n for n in neighbors.postal_code if n != row.postal_code])
        adjacency_list[row.postal_code] = {
            "name": row.postal_code_name,
            "neighbors": neighbors_sorted
        }

    adjacency_list = dict(sorted(adjacency_list.items()))
    return adjacency_list


if __name__ == "__main__":
    try:
        osm_data = json.load(open(".osm_data.json"))
        print("osm data loaded from .osm_data.json.")
    except FileNotFoundError:
        print(f"osm data not found. Fetching from {OVERPASS_URL}.")
        osm_data = fetch_postal_code_data()
        with open(".osm_data.json", "w") as f:
            json.dump(osm_data, f)

    postal_gdf = parse_postal_codes(osm_data)

    adjacency_list = create_adjacency_list(postal_gdf)

    with open("postal_codes.json", "w") as f:
        json.dump(adjacency_list, f)
