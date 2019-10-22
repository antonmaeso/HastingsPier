
const storageAvailable = (type: string) => {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }    catch (e) {
        return false;
    }
};

export const putLocal = (key: string, value: any) => {
    try {
        if (storageAvailable("localStorage")) {
            const toStore = JSON.stringify(value);
            localStorage.setItem(key, toStore);
            return true;
        }
    } catch (e) {
        return false;
    }
};

export const getLocal = (key: string) => {
    const raw = localStorage.getItem(key);
    const toReturn = JSON.parse(raw);
    return toReturn;
};

export const putSession = (key: string, value: any) => {
    try {
        if (storageAvailable("sessionStorage")) {
            const toStore = JSON.stringify(value);
            sessionStorage.setItem(key, toStore);
            return true;
        }
    } catch (e) {
        return false;
    }
};

export const getSession = (key: string) => {
    const toReturn = JSON.parse(sessionStorage.getItem(key));
    return toReturn;
};
