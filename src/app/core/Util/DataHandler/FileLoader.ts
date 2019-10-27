import * as fs from "fs";
import { ICRUD } from "./ICRUD";

export class FileLoader implements ICRUD {
  public create(Path: string, contents?: string): boolean {
    if (!fs.existsSync(Path)) {
      fs.writeFileSync(Path, contents);
      return true;
    } else {
      return false;
    }
  }
  read(filePath: string): string | false {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    } else {
      throw "Path not found" + filePath;
    }
  }
  update(): Function {
    throw new Error("Method not implemented.");
  }
  delete(): Function {
    throw new Error("Method not implemented.");
  }
}

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
