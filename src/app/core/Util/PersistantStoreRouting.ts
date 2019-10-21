import { ipcRenderer } from "electron";

export class storage {

    public static putLocal(Key:string,Value:any){
        ipcRenderer.send("Storage",{type: "local", key:Key,value:Value})
    }
}