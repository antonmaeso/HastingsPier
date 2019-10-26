import { FileLoader } from "./FileLoader";
const path = require("path");
import { ipcMain } from "electron";
import { ICRUD } from "./ICRUD";

export interface IFileOperations extends ICRUD {}

export interface WebRequest {
  get(source: string): Promise<any>;
  post(source: string, body: string): string;
}

export class DataHandler implements IFileOperations, WebRequest {
  create(): Function {
    throw new Error("Method not implemented.");
  }
  read(source: string): string | false {
    const filePath = path.join(path.resolve(), source);
    const fileOperations: ICRUD = new FileLoader();
    return fileOperations.read(filePath);
  }

  update(): Function {
    throw new Error("Method not implemented.");
  }
  delete(): Function {
    throw new Error("Method not implemented.");
  }

  get = (request: string): Promise<any> => {
    return new Promise(resolve => {
      fetch(request)
        .then(response => response.json())
        .then(body => {
          resolve(body);
        });
    });
  };
  post(source: string, body: string): string {
    throw new Error("Method not implemented.");
  }
}
