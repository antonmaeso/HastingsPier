import * as fs from "fs";

export const readFile = (Path: string) => {
  if (fs.existsSync(Path)) {
    return fs.readFileSync(Path, "utf-8");
  } else {
    throw "Path not found" + Path;
  }
};

export const createFile = (Path: string, contents: string) => {
  if (!fs.existsSync(Path)) {
    fs.writeFileSync(Path, contents);
    return true;
  } else {
    return false;
  }
};

export const replaceFile = (Path: string, contents: string) => {
  if (fs.existsSync(Path)) {
    fs.writeFileSync(Path, contents);
    return true;
  } else {
    return false;
  }
};
