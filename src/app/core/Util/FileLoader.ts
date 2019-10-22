import * as fs from "fs";

export const readFile = (Path: string) => {
  console.log(fs.existsSync(Path));
  if (fs.existsSync(Path)) {
    return fs.readFileSync(Path, "utf-8");
  } else {
    return false;
  }
};

export const createFile = (Path: string, contents: string) => {
  if (!fs.existsSync(Path)) {
    fs.writeFileSync(
      Path,
      contents,
    );
    return true;
  } else {
    return false;
  }
};
