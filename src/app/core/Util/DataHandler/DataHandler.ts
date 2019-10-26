import { FileLoader } from "./FileLoader";
import { ICRUD } from "./ICRUD";
import { IHTTP } from "./IHTTP";
import { WebRequests } from "./WebRequests";

export interface IFileOperations extends ICRUD {
  readOrCreateThenRead(Path: string, contents: string): string | boolean;
}

export interface IWebRequestOperations extends IHTTP {}
//  The idea of this class is to bring together dirrerent ways of accessing data.
// It will eventually have all the basic operations such as CRUD for File and db
// the IFileOperations and IWebRequestOperations will have more complex common operations
//  such as create a file if it dosnt exist then write to it
export class DataHandler extends WebRequests
  implements IFileOperations, IWebRequestOperations {
  constructor() {
    super();
  }
  readOrCreateThenRead(path: string, contents: string): string | boolean {
    if (this.create(path, contents)) {
      return contents;
    }
    return this.read(path);
  }
}
