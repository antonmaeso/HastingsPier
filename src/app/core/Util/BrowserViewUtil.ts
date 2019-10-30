import { ipcRenderer } from "electron";

/**
 * Creates a new electron "BrowserView" to host an exteral site in
 */
export const createView = (
    x: number,
    y: number,
    height: number,
    width: number,
    source: string,
    Application: string) => {
    ipcRenderer.send("CreateBrowserView", {
        height: Math.round(height),
        src: source,
        viewApplication: Application,
        width: Math.round(width),
        x: Math.round(x),
        y: Math.round(y),
    });
};

/**
 * Destroys an already existing BrowserView
 */
export const closeView = (Application: string) => {
    ipcRenderer.send("CloseBrowserView", { viewApplication: Application });
};
/**
 * Hide an already existing BrowserView by moving it off the screen
 */
export const hideView = (Application: string) => {
    ipcRenderer.send("HideBrowserView", { viewApplication: Application });
};
/**
 * Hide all existing BrowserView by moving it off the screen
 */
export const hideAllView = () => {
    ipcRenderer.send("HideAllBrowserView");
};

/**
 * Show an already existing BrowserView by moving it back onto the screen to a specified location.
 * If you want to make the application fill the availible ApplicationWindow space dont pass any x,y, height or width.
 * Also used to resize an existing view
 */
export const showView = (
    Application: string,
    x?: number,
    y?: number,
    height?: number,
    width?: number,
) => {
    ipcRenderer.send("ShowBrowserView", {
        height: Math.round(height),
        viewApplication: Application,
        width: Math.round(width),
        x: Math.round(x),
        y: Math.round(y),
    });
};

