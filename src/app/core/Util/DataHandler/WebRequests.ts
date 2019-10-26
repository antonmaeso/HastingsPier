import { IHTTP } from "./IHTTP";
import { FileLoader } from "./FileLoader";

export class WebRequests extends FileLoader implements IHTTP {
  post(): Function {
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
  put(): Function {
    throw new Error("Method not implemented.");
  }
  delete(): Function {
    throw new Error("Method not implemented.");
  }
}
