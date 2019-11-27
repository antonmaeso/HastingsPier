import { ipcRenderer } from "electron";

interface IInternal {
  app: string;
  windowId?: number;
  data: any;
}

export const internal = (App: string, Data: any, WindowId?: number) => {
  ipcRenderer.send("internal", { app: App, data: Data, windowId: WindowId } as IInternal);
};
