import { ipcMain } from "electron";

export class IpcMainRouting {

    constructor() {
        this.initialiseListeners();
    }

    private initialiseListeners() {
        ipcMain.on("SeperateClass", () => { console.log("In other class"); });
    }

}
