import * as fr from "./FileLoader";
const path = require("path");
import { ipcMain } from "electron";

export interface WebRequest {
  get(source: string): Promise<any>;
  post(source: string, body: string): string;
}

export interface CRUD {
  create(): Function;
  read(source: string): string;
  update(): Function;
  delete(): Function;
}

export class DataHandler implements CRUD, WebRequest {
  private _responseWindow: number;
  constructor() {}
  create(): Function {
    throw new Error("Method not implemented.");
  }
  read(source: string): string {
    const filePath = path.join(path.resolve(), source);
    return fr.readFile(filePath);
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
