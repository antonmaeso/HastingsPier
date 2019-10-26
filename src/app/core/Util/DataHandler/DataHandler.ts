import { FileLoader } from "./FileLoader";
const path = require("path");
import { ICRUD } from "./ICRUD";
import { IHTTP } from "./IHTTP";
import { WebRequests } from "./WebRequests";

export interface IFileOperations extends ICRUD {}

export interface IWebRequestOperations extends IHTTP {}
//  The idea of this class is to bring together dirrerent ways of accessing data.
// It will eventually have all the basic operations such as CRUD for File and db
// the IFileOperations and IWebRequestOperations will have more complex common operations
//  such as create a file if it dosnt exist then write to it
export class DataHandler implements IFileOperations, IWebRequestOperations {
  put(): Function {
    throw new Error("Method not implemented.");
  }
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
    return new WebRequests().get(request);
  };
  post(): Function {
    throw new Error("Method not implemented.");
  }
}
