import * as React from "react";

// https://developer.chrome.com/apps/tags/webview Need to set up a native way to hook in to loaded content

export const Webview = (props: any) => {
    let className = "";
    if (props.MaxSize) {
        className = "fullIframe";
    }
    return <webview id={props.uniqueId} className={className} src={props.Src} ></webview>;
};
