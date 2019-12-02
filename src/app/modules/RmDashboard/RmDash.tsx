// import { ipcRenderer } from "electron";
import { ipcRenderer } from "electron";
import * as React from "react";
// import { Button } from "../../core/components/library/Button";
// import { Webview } from "../../core/components/library/Webview";
import * as BV from "../../core/util/BrowserViewUtil";
import * as ps from "../../core/util/PersistantStorage";
// import * as N from "../../core/util/Notify";
import "./style/rmDash.scss";
const WindowId = require('electron').remote.getCurrentWindow().id;

const Src = "https://rmdashboard.network.uk.ad/";
const viewName = "RmDashboard";

export const RmDash = (props: any) => {
    const [display, setDisplay] = React.useState(true);
    const [listener, setListeners] = React.useState(false);

    if (!listener) {
        setupListeners(setDisplay, viewName);
        setListeners(true);
    }
    const [reloaded, setReloaded] = React.useState(false);
    if (!reloaded) {
        const loaded = ps.getSession(viewName + WindowId);
        if (loaded !== undefined && loaded !== null) {
            setDisplay(loaded);
        }
        setReloaded(true);
    }
    const [initialised, setInitialised] = React.useState(false);

    let methodToRun: any;
    if (display && initialised) {
        methodToRun = () => { showView(); };
    } else if (display && !initialised) {
        methodToRun = () => { addBrowserView(setInitialised); };
    } else if (!display && initialised) {
        methodToRun = () => { hideView(); };
    }

    // return null;
    return <React.Fragment>
        <div className="RmDash">
            {methodToRun()}
            {/* <Webview Src={Src} MaxSize={true} uniqueId={webviewId} /> */}
        </div>
        {/* <Button onClick={hideView} text="Hide View" />
        <Button onClick={showView} text="Show View" /> */}
    </React.Fragment>;
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

const setupListeners = (setDisplay: React.Dispatch<React.SetStateAction<boolean>>, identifier: string) => {
    console.log("RmDash Creating listeners: ActiveApplication");
    ipcRenderer.on("activeApplication", (event: any, value: any) => {
        if (value !== undefined) {
            const show = (value === identifier);
            setDisplay(show);
            saveStateToSession(show);
        }
    });
};

const saveStateToSession = (display: boolean) => {
    ps.putSession(viewName + WindowId, display);
};

const hideView = () => {
    BV.hideView(viewName);
};

const showView = () => {
    try {
        const bounding = document.getElementsByClassName("applicationWindow active")[0].getBoundingClientRect();
        BV.showView(viewName, bounding.left, bounding.top, bounding.height, bounding.width);
    } catch{ }
};

const addBrowserView = (setInitialised: React.Dispatch<React.SetStateAction<boolean>>) => {
    // const bounding = document.getElementsByClassName("applicationWindow active")[0].getBoundingClientRect();

    BV.createView(10, 10, 10, 10, Src, viewName);
    setInitialised(true);

    // ipcRenderer.send("CreateBrowserView", {
    //     height: Math.round(bounding.height),
    //     src: Src,
    //     viewApplication: "RMDash",
    //     width: Math.round(bounding.width),
    //     x: Math.round(bounding.left),
    //     y: Math.round(bounding.top),
    // });
};
