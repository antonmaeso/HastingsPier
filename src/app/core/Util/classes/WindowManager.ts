import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { Logger } from "./LoggerUtil";
import * as N from "../Notify";
// tslint:disable-next-line: no-var-requires
const Path = require("path");

class WindowObject {
    public Window: BrowserWindow;
    public LoadedApp: string;

    constructor(window: BrowserWindow, toShow: string) {
        this.Window = window;
        this.LoadedApp = toShow;
    }
}

const currentWindows: Map<number, WindowObject> = new Map();

// tslint:disable-next-line: max-classes-per-file
export class WindowControl {

    private iconpath = "";
    private Log: Logger;

    constructor(deaultIcon: string, log: Logger) {
        this.iconpath = deaultIcon;
        this.Log = log;
    }

    public route = (arg: any) => {
        const target = arg.target;
        switch (target) {
            case "createWindow": {
                const windowId = this.createNewWindow(arg.data.details, arg.data.filename, arg.data.appToShow);
                return windowId;
            }
            case "getWindow": {
                return this.getWindow(arg.data);
            }
            case "navigateTo": {
                return this.navigateTo(arg.data.windowId, arg.data.uri);
            }
            case "focusWindow": {
                return this.focusWindow(arg.data);
            }
            case "closeWindow": {
                return this.closeWindow(arg.data);
            }
            case "activeApp": {
                return this.activeApp(arg.data);
            }
            default: {
                return null;
            }
        }
    }

    public createNewWindow = (windowDetails?: object, filename?: string, loadSpecificApp?: string) => {
        let newWindow: BrowserWindow;
        if (windowDetails === undefined || windowDetails === null) {
            newWindow = new BrowserWindow({
                frame: false,
                height: 600,
                icon: this.iconpath,
                minWidth: 480,
                webPreferences: {
                    nodeIntegration: true,
                },
                width: 800,
            });
        } else {
            newWindow = new BrowserWindow(windowDetails as BrowserWindowConstructorOptions);
        }

        const windowId = newWindow.id;
        newWindow.on("close", () => {
            if (newWindow.id === 1 && currentWindows.size > 1) {
                // close all windows
                // tslint:disable-next-line: prefer-for-of
                for (let i = currentWindows.size; i > 1; i--) {
                    this.closeWindow(i);
                }
            }

            /// #if env == 'DEBUG'
            // tslint:disable-next-line: no-console
            console.log(`Window was closed, id = ${windowId}`);
            /// #endif

            currentWindows.delete(windowId);
            this.notifyUpdateWindowIDs(windowId);
        });

        // The window identifier can be checked from the Renderer side.
        // `win.loadFile` will escape `#` to `%23`, So use `win.loadURL`
        let file = "index.html";
        if (filename !== undefined && filename !== null && filename !== file) {
            file = filename;
        }

        const filePath = Path.join(__dirname, file);
        newWindow.loadURL(`file://${filePath}#${windowId}`);

        // if no specific app specified, use ApplicationSelection
        let toDisplay = "ApplicationSelection";
        if (loadSpecificApp !== undefined && loadSpecificApp !== null) {
            toDisplay = loadSpecificApp;
        }

        currentWindows.set(windowId, new WindowObject(newWindow, toDisplay));
        this.notifyUpdateWindowIDs(windowId);

        return windowId;
    }

    public closeWindow = (id: number) => {
        currentWindows.get(id).Window.close();
    }

    public focusWindow = (id: number) => {
        currentWindows.get(id).Window.focus();
        return true;
    }

    public getWindow = (id: number) => {
        return currentWindows.get(id).Window;
    }

    public navigateTo = (windowId: number, uri: string) => {
        currentWindows.get(windowId).Window.loadURL(uri);
    }

    private notifyUpdateWindowIDs = (excludeId: number) => {
        const windowIds = Array.from(currentWindows.keys());
        currentWindows.forEach((w) => {
            if (w.Window.id === excludeId) {
                return;
            }
            w.Window.webContents.send("UpdateWindowIds", windowIds);
        });
    }

    private activeApp(data: any) {
        const windowId = data.windowId;
        let app = data.Active;
        if (app === undefined) {
            app = currentWindows.get(windowId).LoadedApp;
            N.setActiveApplication(app, windowId);
            // N.setWindowTitle(app, windowId);
            return app;
        } else {
            currentWindows.get(windowId).LoadedApp = app;
        }
    }

    private wait(ms: number) {
        let time = new Date().getTime();
        const end = time + ms;
        while (time < end) {
            time = new Date().getTime();
        }
    }
}
