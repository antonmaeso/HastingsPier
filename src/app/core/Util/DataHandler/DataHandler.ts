import { FileLoader } from "./FileLoader";
import { ICRUD } from "./ICRUD";
import { IHTTP } from "./IHTTP";
import { WebRequests } from "./WebRequests";
const path = require("path");

export interface IFileOperations extends ICRUD {
  readOrCreateThenRead(Path: string, contents: string): string | boolean;
}

export interface IWebRequestOperations extends IHTTP {}
//  The idea of this class is to bring together dirrerent ways of accessing data.
// It will eventually have all the basic operations such as CRUD for File and db
// the IFileOperations and IWebRequestOperations will have more complex common operations
//  such as create a file if it dosnt exist then write to it
// experimenting with a singleton design patern
export class DataHandler extends WebRequests
  implements IFileOperations, IWebRequestOperations {
  public static projectDir: string = path.resolve();
  public static projectDist: string = path.join(path.resolve(), "/dist");
  public static DataHandlerInstance: DataHandler;
  constructor() {
    super();
  }

  static createDataHandler(): any {
    if (DataHandler.DataHandlerInstance != undefined) {
      return this.DataHandlerInstance;
    }
    this.DataHandlerInstance = new DataHandler();
    return this.DataHandlerInstance;
  }

  readOrCreateThenRead(path: string, contents: string): string | boolean {
    if (this.create(path, contents)) {
      return contents;
    }
    return this.read(path);
  }
}
