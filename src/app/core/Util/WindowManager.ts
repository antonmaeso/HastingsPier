import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
// tslint:disable-next-line: no-var-requires
const Path = require("path");

const currentWindows: Map<number, BrowserWindow> = new Map();

export class WindowControl {

    private iconpath = "";
    constructor(deaultIcon: string) {
        this.iconpath = deaultIcon;
    }

    public route = (arg: any) => {
        const target = arg.target;
        switch (target) {
            case "createWindow": {
                return this.createNewWindow(arg.data.details, arg.data.filename);
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
            default: {
                return null;
            }
        }
    }

    public createNewWindow = (windowDetails?: object, filename?: string) => {
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

        currentWindows.set(windowId, newWindow);
        this.notifyUpdateWindowIDs(windowId);
        return windowId;
    }

    public closeWindow = (id: number) => {
        currentWindows.get(id).close();
    }

    public focusWindow = (id: number) => {
        currentWindows.get(id).focus();
        return true;
    }

    public getWindow = (id: number) => {
        return currentWindows.get(id);
    }

    public navigateTo = (windowId: number, uri: string) => {
        currentWindows.get(windowId).loadURL(uri);
    }

    private notifyUpdateWindowIDs = (excludeId: number) => {
        const windowIds = Array.from(currentWindows.keys());
        currentWindows.forEach((w) => {
            if (w.id === excludeId) {
                return;
            }

            w.webContents.send("UpdateWindowIds", windowIds);
        });
    }
}
