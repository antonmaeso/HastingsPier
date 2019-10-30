import { ipcRenderer } from "electron";

/**
 * Send a balloon notification with your title and contents
 */
export const Balloon = (Title: string, Contents: string, Other?: any) => {
    ipcRenderer.send("balloon", { title: Title, contents: Contents, other: Other });
};

/**
 * Sends a notification to an application in the appBar
 */
export const AppNotification = (AppName: string, notificationToDisplay: string) => {
    ipcRenderer.send("AppBarNotify", { App: AppName, Notification: notificationToDisplay });
};

/**
 * Changes the title displayed in the application
 */
export const setWindowTitle = (title: string, windowId?: number) => {
    ipcRenderer.send("menuTitle", { Title: title, WindowId: windowId });
};

/**
 * Sets the application which is currently being displayed
 */
export const setActiveApplication = (App: string, window?: number) => {
    ipcRenderer.send("activeApplication", { Active: App, WindowId: window });
};

/**
 * Removes an application from the DOM.
 */
export const closeApplication = (App: string, windowId?: number) => {
    ipcRenderer.send("closeApplication", { Close: App, WindowId: windowId });
};
