import { BrowserView, ipcMain, Rectangle } from "electron";
import { control, mainWindowId } from "../../../main";

export class BrowserViewControl {
    // map of browser views. Key is the app name in the view. Value is the view
    private activeViews = new Map<string, BrowserView>();
    constructor() {
        this.initaliseListeners();
    }
    private initaliseListeners() {
        ipcMain.on("CreateBrowserView", (event: any, value: any) => {
            const Src = value.src;
            const viewApplication = value.viewApplication;
            const view = new BrowserView();
            control.getWindow(mainWindowId).setBrowserView(view);
            const bound: Rectangle = { x: value.x, y: value.y, width: value.width, height: value.height };
            view.setAutoResize({ width: true, height: true, horizontal: false, vertical: false });
            view.setBounds(bound);
            view.webContents.loadURL(Src);
            // add to dictionary
            this.activeViews.set(viewApplication, view);
            // recentView.webContents.executeJavaScript()
        });
        ipcMain.on("CloseBrowserView", (event: any, value: any) => {
            const viewApplication = value.viewApplication;
            const view = this.activeViews.get(viewApplication);
            if (view !== undefined && view !== null) {
                view.destroy(); // currently only way to get rid of view
                this.activeViews.delete(viewApplication);
            }
        });
        ipcMain.on("ShowBrowserView", (event: any, value: any) => {
            const viewApplication = value.viewApplication;
            const viewToShow = this.activeViews.get(viewApplication);
            // to show, move it back on the screen
            try {
                this.resizeView(viewToShow, value.x, value.y, value.height, value.width);
            } catch {
                console.log("Not enough information was sent to show Browser View");
            }
        });
        ipcMain.on("HideBrowserView", (event: any, value: any) => {
            const viewApplication = value.viewApplication;
            const viewToHide = this.activeViews.get(viewApplication);
            this.hideView(viewToHide);
        });
        ipcMain.on("HideAllBrowserView", () => {
            // loop through all views and hide them
            Array.from(this.activeViews.keys()).forEach((key) => {
                this.hideView(this.activeViews.get(key));
            });
        });
    }

    private resizeView = (view: BrowserView, X: number, Y: number, Height: number, Width: number) => {
        view.setBounds({ x: X, y: Y, height: Height, width: Width });
    }

    private hideView = (view: BrowserView) => {// to hide, move it off the screen
        this.resizeView(view, 3000, 3000, 10, 10);
    }
}
