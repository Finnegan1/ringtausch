import { User } from "@prisma/client";
import * as fs from "fs";

import Random from "./random";

type PostalCodes = {
  [key: string]: { neighbors: string[]; name: string };
};

/**
 * Simple faker class to generate random names,email addresses and postal codes.
 * All generated names are unique and consist of ONE first name and ONE last name.
 */
export class Faker {
  private readonly emailProvider =
    "gmail.com,yahoo.de,yahoo.com,outlook.com,hotmail.com,web.de,gmx.de,gmx.net,t-online.de,freenet.de,protonmail.com,icloud.com,aol.com,zoho.com,mail.com,posteo.de,fastmail.com,me.com,live.com,yandex.com".split(
      ","
    );
  private readonly firstNames =
    "Maximilian Leon Paul Elias Ben Louis Noah Jonas Felix Lukas Henry Emil Anton Matteo Moritz Theo Julian Finn Samuel David Jakob Philipp Linus Simon Niklas Johannes Valentin Leo Alexander Vincent Oskar Tom Erik Adrian Sebastian Fabian Konstantin Benjamin Tim Carl Malte Julian Florian Hendrik Oliver Hannes Marlon Levi Luca Jonathan Emma Mia Emilia Sophia Hannah Lina Marie Lea Johanna Amelie Luisa Anna Lena Charlotte Clara Ella Leni Lara Sarah Leonie Mathilda Frieda Ida Maja Helene Alina Carlotta Viktoria Elina Pauline Isabel Ronja Greta Nele Melina Lotta Katharina Theresa Elisa Miriam Jule Rebecca Marlene Antonia Selina Franziska Annika Valentina Tabea Julia".split(
      " "
    );
  private readonly lastNames =
    "Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger Hofmann Hartmann Lange Schmitt Werner Schmitz Krause Meier Lehmann Schmid Schulze Maier Köhler Herrmann König Walter Mayer Huber Kaiser Fuchs Peters Lang Scholz Möller Weiß Jung Hahn Schubert Vogel Friedrich Keller Günther Frank Berger Winkler Roth Beck Lorenz Baumann Voigt Sauer Winter Haas Sommer Graf Seidel Simon Böhm Brandt Jäger Krämer Schumann Engelmann Ziegler Busch Kühn Pohl Horn Arnold Kessler Barth Ludwig Schröter Vogt Sauerland Nowak Hauser Otto Albrecht Dreyer Sander Stark Förster Kunze Heinze Krämer Ebert Schuster Fiedler Rudolph Ullrich".split(
      " "
    );
  private readonly streetNames =
    "Hauptstraße,Bahnhofstraße,Schulstraße,Gartenstraße,Dorfstraße,Bergstraße,Kirchstraße,Lindenstraße,Rosenstraße,Sonnenstraße,Beethovenstraße,Mozartstraße,Goethestraße,Schillerstraße,Lessingstraße,Kantstraße,Wilhelmstraße,Friedrichstraße,Humboldtstraße,Jahnstraße,Hegelstraße,Uhlandstraße,Bachstraße,Ringstraße,Marktplatz,Brunnenstraße,Waldstraße,Birkenstraße,Tulpenweg,Nelkenweg,Kastanienallee,Buchenweg,Eichenstraße,Akazienweg,Eschenstraße,Fichtenstraße,Ahornweg,Kiefernweg,Tannenstraße,Sommerstraße,Herbststraße,Winterstraße,Mühlenstraße,Brückenstraße,Wiesenweg,Feldstraße,Industriestraße,Talstraße,Höhenweg,Am Hang,Am Wald,Am Bach,Am Sportplatz,Am Markt,Am Rathaus,Am Anger,Am Bahnhof,Am Schulberg,Am Sonnenhang,Zum Dorfplatz,Zum Weiher,Zum Brunnen,An der Kirche,An der Mühle,An der Schule,An der Linde,An der Eiche,An den Linden,Zum Sportplatz,Zum Spielplatz,Alte Straße,Neue Straße,Mittelstraße,Oberstraße,Unterstraße,Weststraße,Oststraße,Südstraße,Nordstraße,Bahnhofplatz,Rathausplatz,Kirchplatz,Schulplatz,Marktstraße,Handelsstraße,Schmiedestraße,Weberstraße,Bäckerstraße,Schreinerweg,Poststraße,Hafenstraße,Uferstraße,Seestraße,Teichweg,Brunnengasse,Dorfanger,Vogelsang,Lerchenweg,Meisenweg,Finkenweg".split(
      ","
    );

  private generatedNames = new Set<string>();
  private ids = new Set<number>();
  private postalCodes: PostalCodes = {};
  private rnd = new Random(12345);

  /**
   * Returns a random email address based on the given name.
   */
  public generateEmail(name: string): string {
    const provider = this.emailProvider[this.rnd.randIntBetween(0, this.emailProvider.length - 1)];
    const mail = `${this.getFirstName(name).toLowerCase()}.${this.getLastName(name).toLowerCase()}@${provider}`;
    return mail
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/ /g, ".");
  }

  /**
   * Returns a random id that has not been generated before.
   */
  public generateId(): number {
    const id = this.rnd.randIntBetween(1000000, 9999999);
    if (!this.ids.has(id)) {
      this.ids.add(id);
      return id;
    } else {
      return this.generateId();
    }
  }

  /**
   * Returns a random name that has not been generated before.
   * Please note that you CANNOT generate more than 10,000 unique names
   * with this generator and you SHOULD NOT generate more than 9,500 names
   * for performance reasons.
   */
  public generateName(): string {
    const firstNameIndex = this.rnd.randIntBetween(0, this.firstNames.length - 1);
    const lastNameIndex = this.rnd.randIntBetween(0, this.lastNames.length - 1);
    const name = `${this.firstNames[firstNameIndex]} ${this.lastNames[lastNameIndex]}`;
    if (!this.generatedNames.has(name)) {
      this.generatedNames.add(name);
      return name;
    } else {
      return this.generateName();
    }
  }

  /**
   * Returns a random postal code from Dresden, Freital, Pirna or Radebeul.
   */
  public async generatePostalCode(): Promise<string> {
    if (Object.keys(this.postalCodes).length === 0) {
      this.postalCodes = await fetchPostalCodes();
      for (const entry in this.postalCodes) {
        if (["Dresden", "Freital", "Pirna", "Radebeul"].includes(this.postalCodes[entry].name)) {
          continue;
        }
        delete this.postalCodes[entry];
      }
    }
    const postalCodesArray = Object.keys(this.postalCodes);
    return postalCodesArray[this.rnd.randIntBetween(0, postalCodesArray.length - 1)];
  }

  public async generateUser(): Promise<User> {
    const name = this.generateName();
    const postalCode = await this.generatePostalCode();
    return {
      name,
      id: String(this.generateId()),
      firstName: this.getFirstName(name),
      lastName: this.getLastName(name),
      email: this.generateEmail(name),
      postalCode,
      city: this.postalCodes[postalCode].name,
      houseNumber: String(this.rnd.randIntBetween(1, 150)),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: this.rnd.random() > 0.1, // 90% of users have verified their email
      image: null,
      street: `${this.streetNames[this.rnd.randIntBetween(0, this.streetNames.length - 1)]}`,
    };
  }

  /**
   * Returns the first name of a full name.
   */
  public getFirstName(name: string): string {
    return name.split(" ")[0];
  }

  /**
   * Returns the last name of a full name.
   */
  public getLastName(name: string): string {
    return name.split(" ")[1];
  }
}

/**
 * Fetches the postal codes from the postal-codes.json file.
 */
function fetchPostalCodes(): Promise<PostalCodes> {
  const postalCodesPath = `${process.cwd()}/src/constants/postal-codes.json`;
  const promise: Promise<PostalCodes> = new Promise((resolve, reject) => {
    fs.readFile(postalCodesPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data) as PostalCodes);
    });
  });
  return promise;
}
