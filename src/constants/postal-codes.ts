import fs from "fs";

type PostalCodes = {
  [key: string]: { neighbors: string[]; name: string[] };
};

const POSTAL_CODES_PATH = `${process.cwd()}/src/constants/postal-codes.json`;

let postalCodes: PostalCodes = {};

fs.readFile(POSTAL_CODES_PATH, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  postalCodes = JSON.parse(data) as PostalCodes;
});

export { postalCodes };
