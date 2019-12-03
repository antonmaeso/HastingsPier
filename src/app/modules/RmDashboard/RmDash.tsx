// import { ipcRenderer } from "electron";
import { ipcRenderer } from "electron";
import * as React from "react";
import * as BV from "../../core/util/BrowserViewUtil";
import * as ps from "../../core/util/PersistantStorage";
// import * as N from "../../core/util/Notify";
import "./style/rmDash.scss";
const Window = require('electron').remote.getCurrentWindow();
const WindowId = Window.id;

const Src = "https://rmdashboard.network.uk.ad/";
const viewName = "RmDashboard";

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

export const RmDash = (props: any) => {
    const [display, setDisplay] = React.useState(true);
    const [listener, setListeners] = React.useState(false);
    const [reloaded, setReloaded] = React.useState(false);
    const [initialised, setInitialised] = React.useState(false);

    const setupListeners = () => {
        console.log("RmDash Creating listeners: ActiveApplication");
        ipcRenderer.on("activeApplication" + viewName, (event: any, value: any) => {
            if (value !== undefined) {
                const show = (value === viewName);
                setDisplay(show);
                saveStateToSession();
            }
        });
    };
    ipcRenderer.removeAllListeners("AppBarResized" + viewName);
    ipcRenderer.on("AppBarResized" + viewName, () => {
        if (display) {
            showView();
        }
    });

    const saveStateToSession = () => {
        ps.putSession(viewName + WindowId, display);
    };

    const hideView = () => {
        BV.hideView(viewName);
    };

    const showView = () => {
        try {
            Window.webContents.findInPage("RmDashboard Loading");
            Window.webContents.once("found-in-page", () => {
                Window.webContents.stopFindInPage("keepSelection");
                const bounding = document.getElementsByClassName("applicationWindow active")[0].getBoundingClientRect();
                BV.showView(viewName, bounding.left, bounding.top, bounding.height, bounding.width);
            });

            // Window.webContents.once("dom-ready", () => {
            //     console.log("webContents dom-ready");
            // });
            // Window.webContents.once("did-finish-load", () => {
            //     console.log("webContents did-finish-load");
            // });
            // Window.webContents.once("did-stop-loading", () => {
            //     console.log("webContents did-stop-loading");
            // });
            // Window.webContents.once("responsive", () => {
            //     console.log("webContents responsive");
            // });
            // Window.webContents.once("did-frame-finish-load", () => {
            //     console.log("webContents did-frame-finish-load");
            // });

            // Window.once("ready-to-show", () => {
            //     console.log("window ready-to-show");
            // });
            // Window.once("responsive", () => {
            //     console.log("webContents responsive");
            // });

        } catch {
            console.log("Error showing view");
        }
    };

    const addBrowserView = () => {
        // create the browser view off the screen to start
        BV.createView(5000, 5000, 10, 10, Src, viewName);
        setInitialised(true);
    };

    if (!listener) {
        setupListeners();
        setListeners(true);
    }

    if (!reloaded) {
        const loaded = ps.getSession(viewName + WindowId);
        if (loaded !== undefined && loaded !== null) {
            setDisplay(loaded);
        }
        setReloaded(true);
    }

    let methodToRun: any;
    if (display && initialised) {
        methodToRun = () => { showView(); };
    } else if (display && !initialised) {
        methodToRun = () => { addBrowserView(); };
    } else if (!display && initialised) {
        methodToRun = () => { hideView(); };
    }

    React.useEffect(() => {
        return () => { // return is ~ the same as will unmount
            ipcRenderer.removeAllListeners("activeApplication" + viewName);
        };
    }, []);

    // return null;
    return <React.Fragment>
        <div className="RmDash">
            RmDashboard Loading
            {methodToRun()}
        </div>
    </React.Fragment>;
};

// find the env table. Look at each row. the env_name is the environment.
// Look in the row for a TD containing an img. Use img src to indicate status.