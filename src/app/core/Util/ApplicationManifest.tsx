// all Imports are here for all root components
import * as React from "react";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";
import { Example } from "../../modules/Example/example";
import { OctaneParent } from "../../modules/OctaneBurner/OctaneParent";
import { RmDash } from "../../modules/RmDashboard/RmDash";

class App {
    public root: JSX.Element;
    public description: string;
    public glyphicon: string;

    constructor(component: JSX.Element, description: string, glyphicon?: string) {
        this.root = component;
        this.description = description;
        this.glyphicon = glyphicon;
    }
}

// add your component to the map.
export const appMap = new Map<string, App>([
    ["ApplicationSelection", new App(<AppSelection />, "Default for selecting an app")],
    ["Octane", new App(<OctaneParent />, "Burn down your Octane Tasks to keep accurate track of time taken")],
    ["BatManager", new App(<Example />, "For testing stuff as we develop")],
    ["RmDashboard", new App(<RmDash />, "Show RM Dashboard in app", "glyphicon glyphicon-dashboard")],
]);


