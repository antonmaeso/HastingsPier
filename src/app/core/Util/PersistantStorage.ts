import { Logger } from "./Logger";

export class PersistantStore {
    private static SessionStorageEnabled: boolean;
    private static LocalStorageEnabled: boolean;

    private static log: Logger;

    constructor(logger: Logger){
        PersistantStore.log= logger;
    }

    private static storageAvailable(type: string) {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    public static putLocal(key:string ,value: any){
        try{
            if(PersistantStore.storageAvailable("localStorage")){
                // const toStore = JSON.stringify(value);
                localStorage.setItem(key,value);
            }
        }catch(e){
            this.log.Log(e.toString())
        }
    }

    public static getLocal(key:string){
        return localStorage.getItem(key)
    }

    public static putSesion(key:string ,value: any){
        try{
            if(PersistantStore.storageAvailable("sessionStorage")){
                // const toStore = JSON.stringify(value);
                sessionStorage.setItem(key,value);
            }
        }catch(e){
            this.log.Log(e.toString())
        }
    }

    public static getSession(key:string){
        return sessionStorage.getItem(key)
    }
}