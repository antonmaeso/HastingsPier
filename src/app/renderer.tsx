import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dashboard } from "./core/components/Dashboard";
import { MenuBar } from "./core/components/MenuBar";


ReactDOM.render(<Dashboard />, document.getElementById("renderer"));
ReactDOM.render(
    <div className="coreApplication application">
        <MenuBar appTitle="Hastings Pier" />
    </div>,
    document.getElementById("menuBarRender"));
