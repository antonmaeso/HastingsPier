import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dashboard } from "./core/components/Dashboard";
import { MenuBar } from "./core/components/MenuBar";
import { ErrorBoundary } from "./core/components/ErrorBoundry";


ReactDOM.render(
    <ErrorBoundary>
        <Dashboard key="Dashboard" />
    </ErrorBoundary>
    , document.getElementById("renderer"));
ReactDOM.render(
    <ErrorBoundary>
        <div className="coreApplication application">
            <MenuBar key="MenuBar" appTitle="Hastings Pier" />
        </div>
    </ErrorBoundary>
    , document.getElementById("menuBarRender"));
