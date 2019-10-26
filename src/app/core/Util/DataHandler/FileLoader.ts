import * as fs from "fs";
import { ICRUD } from "./ICRUD";

export class FileLoader implements ICRUD {
  create(): Function {
    throw new Error("Method not implemented.");
  }
  read(source: string): string | false {
    if (fs.existsSync(source)) {
      return fs.readFileSync(source, "utf-8");
    } else {
      throw "Path not found" + source;
    }
  }
  update(): Function {
    throw new Error("Method not implemented.");
  }
  delete(): Function {
    throw new Error("Method not implemented.");
  }
}

// export const readFile = (Path: string) => {
//   if (fs.existsSync(Path)) {
//     return fs.readFileSync(Path, "utf-8");
//   } else {
//     throw "Path not found" + Path;
//   }
// };

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
