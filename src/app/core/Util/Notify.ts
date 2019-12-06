import { ipcRenderer } from "electron";

/**
 * @param Title The title of the notification
 * @param Contents The contents of the notification
 * @param Source The application the notification is about. This allows switching to the app when the balloon is clicked.
 * 
 *  Send a balloon notification with your title and contents. If using Source it
 *  must be an application which is currently loaded.
 */
export const Balloon = (Title: string, Contents: string, Source?: string, WindowId?: number) => {
    ipcRenderer.send("balloon", { title: Title, contents: Contents, source: Source, windowId: WindowId });
};

/**
 * @param AppName The name of the application to send a notification to.
 * It is the key from the application Manifest NOT its title
 * @param notificationToDisplay The text to send to the notifiation section of the application
 * 
 * Sends a notification to an application in the appBar
 */
export const AppNotification = (AppName: string, notificationToDisplay: string) => {
    ipcRenderer.send("AppBarNotify", { App: AppName, Notification: notificationToDisplay });
};

/**
 * @param App The identifier for the app you want to add to the app bar
 * @param Title The Title for the app you want to add to the app bar
 *  
 */
export const AppBar = (App: string, Title: string) =>{
    ipcRenderer.send("AppBar", {app: App, title: Title});
}

/**
 * Changes the title displayed in the application
 */
export const setWindowTitle = (title: string, windowId?: number) => {
    ipcRenderer.send("menuTitle", { Title: title, WindowId: windowId });
};

/**
 * Sets the application which is currently being displayed
 */
export const setActiveApplication = (App: string, windowId?: number) => {
    ipcRenderer.send("activeApplication", { Active: App, WindowId: windowId });
};

/**
 * Removes an application from the DOM. "Everything not saved will be lost" - Nintendo quit screen
 */
export const closeApplication = (App: string, windowId?: number) => {
    ipcRenderer.send("closeApplication", { Close: App, WindowId: windowId });
};
