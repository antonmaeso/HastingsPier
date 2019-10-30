
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

/**
 * Saves a value to local storage. Can be retrieved after an application has closed. If possible use session instead.
 * Uses JSON.stringify to store
 */
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

/**
 * Retrieve a value from local storage
 */
export const getLocal = (key: string) => {
    const raw = localStorage.getItem(key);
    const toReturn = JSON.parse(raw);
    return toReturn;
};

/**
 * Saves a value to Session storage. Can not be retrieved after an application has closed.
 * If you need to retrieve after the application has close, use Local.
 * Uses JSON.stringify to store
 */
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

/**
 * Retrieve a value from session storage
 */
export const getSession = (key: string) => {
    const toReturn = JSON.parse(sessionStorage.getItem(key));
    return toReturn;
};
