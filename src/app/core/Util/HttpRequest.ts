/**
 * A Get which is sent using XMLHttpRequest. Good for when you need to talk to something with SSO
 * @param url The url to send the Get to
 * @param after A function to call with the response from the request as the first argument
 * @param extra First additional paramiter to send along with response
 * @param extra2 second additional paramiter to send along with response
 * @param extra3 third additional paramiter to send along with response
 */
export function Get(url: string, after: any, extra?: any, extra2?: any, extra3?: any) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            after(xmlHttp, extra, extra2, extra3);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
            after(xmlHttp, extra, extra2);
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("accept", "application/json");
    xmlHttp.send(null);
}
 /**
  * A Put which is sent using XMLHttpRequest
  * @param url The url to send the Put to
  * @param data The object to be stringified and put
  * @param after A function to call with the response from the request as the first argument
  * @param extra Additional parameter to return as part of the after function
  */
export function Put(url: string, data: any, after?: any, extra?: any) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            after(xmlHttp, extra);
        }
    };
    xmlHttp.open("PUT", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(data);
}

/**
 * A Post which is sent using XMLHttpRequest
 * @param url The url to send the Post to
 * @param data The object to be stringified and posted
 * @param after A function to call with the response from the request as the first argument
 * @param extra First additional parameter to return as part of the after function
 * @param extra2 Second additional parameter to return as part of the after function
 * @param extra3 Thrid additional parameter to return as part of the after function
 */
export function Post(url: string, data: string, after?: any, extra?: any, extra2?: any, extra3?: any) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            after(xmlHttp, extra, extra2, extra3);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
            after(xmlHttp, extra, extra2, extra3);
        }
    };
    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(data);
}

/**
 * A Delete which is sent using XMLHttpRequest
 * @param url The url to send the Post to
 * @param after A function to call with the response from the request as the first argument
 * @param extra First additional parameter to return as part of the after function
 * @param extra2 Second additional parameter to return as part of the after function
 * @param extra3 Thrid additional parameter to return as part of the after function
 */
export function Delete(url: string, after?: any, extra?: any, extra2?: any, extra3?: any) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            after(xmlHttp, extra, extra2, extra3);
        } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
            after(xmlHttp, extra, extra2, extra3);
        }
    };
    xmlHttp.open("DELETE", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send();
}