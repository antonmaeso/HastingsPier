import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../util/Notify";
import * as ps from "../util/PersistantStorage";
import { AppButton } from "./ApplicationButton";
const WindowId = require("electron").remote.getCurrentWindow().id;

let applications = new Map<string, JSX.Element>([
  [
    "ApplicationSelection", <AppButton key="ApplicationSelectionPane" title="ApplicationSelection" appName="ApplicationSelection" />,
  ]]);

export const ApplicationBar = (props: any) => {
  const [appArray, setAppArray] = React.useState(["ApplicationSelection"]);
  // TODO: should change to a map to more accuratly maintain order
  const [showBar, setShowBar] = React.useState(true);
  const [reloaded, setReloaded] = React.useState(false);

  if (!reloaded) {
    // re load state from session
    const appsLoaded = ps.getSession("AppBarApplications" + WindowId);
    const barState = ps.getSession("AppBarOpen" + WindowId);
    if (appsLoaded !== null) {
      buildAppsFromstore(appsLoaded.reverse(), setAppArray);
    }
    if (barState !== null) {
      setShowBar(barState);
    }
    setReloaded(true);
  }

  StartListeners(appArray, setAppArray);

  // Notify.Balloon("AppBar", applications.length + " Apps in state");
  let className = "applicationBar";
  let arrow = "<";
  if (!showBar) {
    className += " hide";
    arrow = ">";
  }

  return (
    <React.Fragment>
      <div className={className}>
        {Array.from(applications.values())}
      </div>
      <div className="CollapseBar"
        onClick={() => {
          setShowBar(!showBar);
          ps.putSession("AppBarOpen" + WindowId, !showBar);
        }} >
        <div style={{ display: "flex", alignSelf: "center" }}>
          {arrow}
        </div>
      </div>
    </React.Fragment>
  );
};

const buildAppsFromstore = (appArray: [], setAppArray: React.Dispatch<React.SetStateAction<any[]>>) => {
  const newMap = new Map<string, JSX.Element>();
  appArray.forEach((appName) => {
    newMap.set(appName, createAppButton(appName, appName));
  });
  applications = newMap;
  setAppArray(Array.from(applications.values()));
};

const createAppButton = (appName: string, title: string) => {
  return <AppButton key={appName + "Pane"} appName={appName} title={title} />;
};


const addApplicationToBar = (appName: string, existingApps: any[]) => {
  // just update the existing array with a new element, might avoid redrawing
  // trigger the redraw by changing the array of app options
  applications.set(appName, createAppButton(appName, appName));
  return [appName].concat(existingApps);
};

const removeAppFromBar = (appName: string) =>{
  
}

const StartListeners = (appArray: string[], setAppArray: React.Dispatch<React.SetStateAction<string[]>>) => {
  const listener = "AppBar";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    if (!appArray.includes(value)) {
      const newList = addApplicationToBar(value, appArray);
      setAppArray(newList);
      ps.putSession("AppBarApplications" + WindowId, newList);
    }
  });
  ipcRenderer.on("closeApplication", (event: any, value: any) => {
    applications.delete(value);
  });
};

