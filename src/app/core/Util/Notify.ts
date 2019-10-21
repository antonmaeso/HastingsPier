import { ipcRenderer } from "electron";

export class Notify {

    public static Balloon = (Title: string, Contents: string, Other?: any) => {
        ipcRenderer.send("balloon", { title: Title, contents: Contents, other: Other });
    }

    public static AppNotification = (AppName: String, notificationToDisplay: string) => {
        ipcRenderer.send("AppBarNotify", { App: AppName, Notification: notificationToDisplay })
    }

    public static setWindowTitle = (Title: string, WindowId?: Number) => {
        ipcRenderer.send("menuTitle", { Title: Title, WindowId: WindowId })
    }
}