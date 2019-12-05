import { ipcRenderer } from "electron";

export const log = (toRecord: string) => {
    ipcRenderer.send("logger", { ToRecord: toRecord });
}