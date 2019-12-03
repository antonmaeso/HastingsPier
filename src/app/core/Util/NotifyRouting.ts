import { ipcMain } from "electron";
import { balloon, control, mainWindowId } from "../../../main";

export class NotifyRouting {

    private activeApplication: string;
    private applicationList: Map<string, boolean> = new Map<string, boolean>([["ApplicationSelection", true]]);

    constructor() {
        this.initaliseListeners();
    }

    public initaliseListeners() {
        ipcMain.on("balloon", (event: any, arg: any) => {
            balloon(arg.title, arg.contents, arg.other);
        });
        // ipc main routing to util classes
        // ipc routing for app bar notifications
        ipcMain.on("AppBarNotify", (event: any, value: any) => {
            control.getWindow(mainWindowId).webContents.send("notify" + value.App, value.Notification);
        });
        // ipc routing for application pane
        ipcMain.on("AppBar", (event: any, value: any) => {
            control.getWindow(mainWindowId).webContents.send("AppBar", value);
        });
        // ipc routing to change Title
        ipcMain.on("menuTitle", (event: any, value: any) => {
            let windowId = mainWindowId;
            if (value.WindowId !== undefined && value.WindowId !== null) {
                windowId = value.WindowId;
            }
            control.getWindow(windowId).webContents.send("menuTitle", value.Title);
        });
        // to choose Active Application
        ipcMain.on("activeApplication", (event: any, value: any) => {
            let windowId = mainWindowId;
            if (value.WindowId !== undefined && value.WindowId !== null) {
                windowId = value.WindowId;
            }
            this.activeApplication = value.Active;
            // add to active list if its not there
            if (!this.applicationList.has(value.Active)) {
                this.applicationList.set(value.Active, true);
            }
            // loop thorugh list to set the active flag and send the ipc notifications out
            Array.from(this.applicationList.keys()).forEach((key) => {
                this.applicationList.set(key, (key === value.Active));
                control.getWindow(windowId).webContents.send("activeApplication" + key, value.Active);
            });

            control.getWindow(windowId).webContents.send("activeApplication", value.Active);
        });

        // to remove an application from the DOM
        ipcMain.on("closeApplication", (event: any, value: any) => {
            let window = mainWindowId;
            if (value.WindowId !== undefined) {
                window = value.WindowId;
            }
            value.Active = this.activeApplication;
            control.getWindow(window).webContents.send("closeApplication", value);
            if (this.applicationList.has(value.Active)) {
                this.applicationList.delete(value.Active);
            }
        });

        // when the app bar has resized   
        ipcMain.on("AppBarResized", () => {
            Array.from(this.applicationList.keys()).forEach((key) => {
                control.getWindow(mainWindowId).webContents.send("AppBarResized" + key);
            });
        });
    }
}
