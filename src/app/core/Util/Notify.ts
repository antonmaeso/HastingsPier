import { ipcRenderer } from "electron";

export const Balloon = (Title: string, Contents: string, Other?: any) => {
    ipcRenderer.send("balloon", { title: Title, contents: Contents, other: Other });
};

export const AppNotification = (AppName: string, notificationToDisplay: string) => {
    ipcRenderer.send("AppBarNotify", { App: AppName, Notification: notificationToDisplay });
};

export const setWindowTitle = (title: string, windowId?: number) => {
    ipcRenderer.send("menuTitle", { Title: title, WindowId: windowId });
};

// public static getWindowTitle = () =>{
//     const toReturn = ipcRenderer.send("getMenuTitle");
// }

export const setActiveApplication = (App: string, window?: number) => {
    ipcRenderer.send("activeApplication", { Active: App, Window: window });
};

