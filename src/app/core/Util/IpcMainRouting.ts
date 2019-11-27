import { ipcMain } from "electron";
import { control, mainWindowId } from "../../../main";

interface IInternal {
    app: string;
    windowId?: number;
    data: any;
  }

export class IpcMainRouting {

    constructor() {
        this.initialiseListeners();
    }

    private initialiseListeners() {
        ipcMain.on("internal", (event: any, arg: IInternal) => {
            // Internal App Communications for talking between components
            let WindowId = arg.windowId;
            if (WindowId === undefined || WindowId === null) {
              WindowId = mainWindowId;
            }
            const window = control.getWindow(WindowId);
            window.webContents.send(arg.app, arg);
          });
    }
}
