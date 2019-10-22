

export class PersistantStore {

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
                const toStore = JSON.stringify(value);
                localStorage.setItem(key,toStore);
                // PersistantStore.log.Log("value");
                return true;
            }
        }catch(e){
            // this.log.Log(e.toString())
            return false;
        }
    }

    public static getLocal(key:string){
        const raw = localStorage.getItem(key)
        const toReturn = JSON.parse(raw);
        return toReturn;
    }

    public static putSession(key:string ,value: any){
        try{
            if(PersistantStore.storageAvailable("sessionStorage")){
                const toStore = JSON.stringify(value);
                sessionStorage.setItem(key,toStore);
                return true;
            }
        }catch(e){
            // this.log.Log(e.toString())
            return false;
        }
    }

    public static getSession(key:string){
        const toReturn =JSON.parse(sessionStorage.getItem(key));
        return toReturn;
    }
}