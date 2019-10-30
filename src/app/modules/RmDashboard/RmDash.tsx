// import { ipcRenderer } from "electron";
// import * as React from "react";
// import { Button } from "../../core/components/library/Button";
// import { Webview } from "../../core/components/library/Webview";
import * as BV from "../../core/util/BrowserViewUtil";
// import * as N from "../../core/util/Notify";
import "./style/rmDash.scss";

const webviewId = "RMDash";
const Src = "https://rmdashboard.network.uk.ad/";

export const RmDash = (props: any) => {
    addBrowserView();
    return null;
    // return <React.Fragment>
    //     <div className="RmDash">
    //         <Webview Src={Src} MaxSize={true} uniqueId={webviewId} />
    //     </div>
    //     <Button onClick={addBrowserView} text="Find env table" />
    // </React.Fragment>;
};

const status = new Map<string, string>([
    ["./assets/img/green.png", "Working"],
    ["./assets/img/red.png", "Down"],
    ["./assets/img/unresponsive.png", "Unresponsive"],
    ["./assets/img/up_green.png", "Starting up"],
    ["./assets/img/down_red.png", "Stopping"],
    ["./assets/img/blue.png", "Draining"],
    ["./assets/img/purple.png", "Deploying"],
    ["./assets/img/unstable.png", "Unstable"],
    ["./assets/img/grey.png", "Switched Off"],
    ["./assets/img/purple_warning.png", "Deployment Error"],
]);

// find the env table. Look at each row. the env_name is the environment.
// Look in the row for a TD containing an img. Use img src to indicate status.
const addListener = () => {
    const EnvTable = document;
    const WebView = document.querySelector("webview");
    console.log(WebView);

    // WebView.addEventListener("")
    // WebView.executeScript({ code: "document.body.style.backgroundColor = 'red'" });
    const table = WebView.getElementsByClassName("title_left");
    console.log(table);
    // BrowserWindow.getFocusedWindow().webContents.addListener()
};


const addBrowserView = () => {
    const bounding = document.getElementsByClassName("applicationWindow")[0].getBoundingClientRect();

    BV.createView(bounding.left, bounding.top, bounding.height, bounding.width, Src, "RMDash");

    // ipcRenderer.send("CreateBrowserView", {
    //     height: Math.round(bounding.height),
    //     src: Src,
    //     viewApplication: "RMDash",
    //     width: Math.round(bounding.width),
    //     x: Math.round(bounding.left),
    //     y: Math.round(bounding.top),
    // });
};
