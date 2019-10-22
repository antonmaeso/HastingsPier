// all Imports are here for all root components
import * as React from "react";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";
import { Example } from "../../modules/Example/example";
import { OctaneParent } from "../../modules/OctaneBurner/OctaneParent";

class App {
    public root: JSX.Element;
    public description: string;

    constructor(component: JSX.Element, description: string) {
        this.root = component;
        this.description = description;
    }
}

// add your component to the map.
export const appMap = new Map<string, App>([
    ["ApplicationSelection", new App(<AppSelection />, "Default for selecting an app")],
    ["Octane", new App(<OctaneParent />, "Burn down your Octane Tasks to keep accurate track of time taken")],
    ["BatManager", new App(<Example />, "For testing stuff as we develop")],
]);


