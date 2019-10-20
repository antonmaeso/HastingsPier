import { ipcRenderer } from "electron";

export class Notify {

    public static Balloon = (Title: string, Contents: string, Other?: any) =>{
        ipcRenderer.send("balloon", { title: Title, contents: Contents, other: Other });
    }
}