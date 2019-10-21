import { ipcRenderer } from "electron";

export class Notify {

    public static Balloon = (Title: string, Contents: string, Other?: any) => {
        ipcRenderer.send("balloon", { title: Title, contents: Contents, other: Other });
    }

    public static AppNotification = (AppName: string, notificationToDisplay: string) => {
        ipcRenderer.send("AppBarNotify", { App: AppName, Notification: notificationToDisplay });
    }

    public static setWindowTitle = (Title: string, WindowId?: number) => {
        ipcRenderer.send("menuTitle", { Title: Title, WindowId: WindowId });
    }

    // public static getWindowTitle = () =>{
    //     const toReturn = ipcRenderer.send("getMenuTitle");
    // }

    public static setActiveApplication = (App: string) => {
        ipcRenderer.send("activeApplication", { Active: App });
    }
}
