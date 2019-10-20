import * as fs from "fs";
import * as path from "path";

const __dirname = path.resolve();

export const readJsonFile = () => {
  const relativeFilePath = path.join(__dirname + "/dist", "/HastingsPier.json");
  console.log(fs.existsSync(relativeFilePath));
  if (!fs.existsSync(relativeFilePath)) {
    fs.writeFileSync(
      relativeFilePath,
      '{"apps":[{"appName":"TheAppFinderGeneral"}]}'
    );
  }

  return fs.readFileSync(relativeFilePath, "utf-8");
};
