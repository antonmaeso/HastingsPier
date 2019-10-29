import * as React from "react";
import { Webview } from "../../core/components/library/Webview";
import "./style/rmDash.scss";

const webviewId = "RMDash";

export const RmDash = (props: any) => {
    const Src = "https://rmdashboard.network.uk.ad/";
    return <div className="RmDash">
        <Webview Src={Src} MaxSize={true} uniqueId={webviewId} />
    </div>;
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
    const EnvTable = document.getElementById("environmentDataTable");
    
};
