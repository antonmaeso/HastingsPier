import * as fs from "fs";
const path = require("path");

export const readJsonFile = (fileLocation: string) => {
  fs.writeFile(path.join(__dirname, "/HastingsPier.json"), "", function(err) {
    if (err) throw err;
    console.log("Saved!");
  });

  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "/HastingsPier.json"), "utf-8")
  );
};
