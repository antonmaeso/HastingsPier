import { ipcMain } from "electron";
import { balloon, control, mainWindowId } from "../../../../main";

export class NotifyRouting {

    private activeApplication: string;
    private applicationList: Map<string, boolean> = new Map<string, boolean>([["ApplicationSelection", true]]);

    constructor() {
        this.initaliseListeners();
    }

    public getLoadedApps() {
        return this.applicationList;
    } public getActiveApp() {
        return this.activeApp;
    }

    public MenuTitle(Title: string, WindowId?: number) {
        let windowId = mainWindowId;
        if (WindowId !== undefined && WindowId !== null) {
            windowId = WindowId;
        }
        control.getWindow(windowId).webContents.send("menuTitle", Title);
    }

    public setActiveApplication(app: string) {
        this.activeApplication = app;
    }

    public addToActiveList(app: string, active?: boolean) {
        if (active === undefined || active === null) {
            active = true;
        }
        if (!this.applicationList.has(app)) {
            this.applicationList.set(app, active);
        }
    }

    public removeFromActiveList(remove: string) {
        this.applicationList.delete(remove);
    }

    public activeApp(app?: string, WindowId?: number) {
        let Active = this.activeApplication;
        if (app !== null && app !== undefined) {
            Active = app;
        }
        // add to active list if its not there
        if (!this.applicationList.has(Active)) {
            this.addToActiveList(Active, true);
        }
        // loop thorugh list to set the active flag and send the ipc notifications out

        Array.from(this.applicationList.keys()).forEach((key) => {
            this.applicationList.set(key, (key === Active));
            control.getWindow(WindowId).webContents.send("activeApplication" + key, Active);
        });

        control.getWindow(WindowId).webContents.send("activeApplication", app);
    }

    private initaliseListeners() {
        ipcMain.on("balloon", (event: any, arg: any) => {
            balloon(arg.title, arg.contents, arg.source, arg.windowId);
        });
        // ipc main routing to util classes
        // ipc routing for app bar notifications
        ipcMain.on("AppBarNotify", (event: any, value: any) => {
            control.getWindow(mainWindowId).webContents.send("notify" + value.App, value.Notification);
        });
        // ipc routing for application pane
        ipcMain.on("AppBar", (event: any, value: any) => {
            const app = value.app;
            // add app to list of availible apps
            this.addToActiveList(app, false);

            control.getWindow(mainWindowId).webContents.send("AppBar", value);
        });
        // ipc routing to change Title
        ipcMain.on("menuTitle", (event: any, value: any) => {
            this.MenuTitle(value.Title, value.WindowId);
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
