import * as React from "react";

// https://developer.chrome.com/apps/tags/webview Need to set up a native way to hook in to loaded content

export const IFrame = (props: any) => {
    let className = "";
    if (props.MaxSize) {
        className = "fullIframe";
    }
    return <webview className={className} src={props.Src} />;
};
