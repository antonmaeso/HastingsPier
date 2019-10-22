import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../util/Notify";
import * as ps from "../util/PersistantStorage";
import { AppButton } from "./ApplicationButton";

let applications = [
  <AppButton key="ApplicationSelectionPane" title="ApplicationSelection" />,
];

export const ApplicationBar = (props: any) => {
  const [appArray, setAppArray] = React.useState(["ApplicationSelection"]);
  const [showBar, setShowBar] = React.useState(true);
  const [reloaded, setReloaded] = React.useState(false);

  if (!reloaded) {
    // re load state from session
    const appsLoaded = ps.getSession("AppBarApplications");
    const barState = ps.getSession("AppBarOpen");
    if (appsLoaded !== null) {
      buildAppsFromstore(appsLoaded.reverse(), setAppArray);
    }
    if (barState !== null) {
      setShowBar(barState);
    }
    setReloaded(true);
  }

  const listener = "AppBar";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    if (!appArray.includes(value)) {
      const newList = addApplicationToBar(value, appArray);
      setAppArray(newList);
      ps.putSession("AppBarApplications", newList); // doesnt like react elements
    }
  });
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
        {applications}
      </div>
      <div className="CollapseBar"
        onClick={() => {
          setShowBar(!showBar);
          ps.putSession("AppBarOpen", !showBar);
        }} >
        <div style={{ display: "flex", alignSelf: "center" }}>
          {arrow}
        </div>
      </div>
    </React.Fragment>
  );
};

const buildAppsFromstore = (appArray: [], setAppArray: React.Dispatch<React.SetStateAction<any[]>>) => {
  const newArray: JSX.Element[] = [];
  appArray.forEach((appName) => {
    newArray.push(createAppButton(appName));
  });
  applications = newArray;
  setAppArray(appArray);
};

const createAppButton = (appName: string) => {
  return <AppButton key={appName + "Pane"} title={appName} />;
};


const addApplicationToBar = (appName: string, existingApps: any[]) => {
  // just update the existing array with a new element, might avoid redrawing
  // trigger the redraw by changing the array of app options
  applications.push(createAppButton(appName));
  return [appName].concat(existingApps);
};
