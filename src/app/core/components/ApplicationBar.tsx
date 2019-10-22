import { ipcRenderer } from "electron";
import * as React from "react";
import { Notify } from "../util/Notify";
import { PersistantStore as ps } from "../util/PersistantStorage";
import { AppButton } from "./ApplicationButton";

// class appButton {
//   private button: JSX.Element;
//   private title: string;
//   private key: string;
//   private active = false;
//   private notification = "0";

//   constructor(Title: string) {
//     this.title = Title;
//     this.key = Title + "Pane";
//     this.button = <AppButton key={this.key} title={Title} />;
//   }

//   public setNotification(n: string) {
//     this.notification = n;
//   }
//   public setActive(a: boolean) {
//     this.active = a;
//   }

//   public Title() {
//     return this.title;
//   }

//   public Button() {
//     return this.button;
//   }
// }

// const applicationHC = [
//   // TODO: look this up from a util class
//   new appButton("ApplicationSelection"),
//   new appButton("Octane"),
//   new appButton("BatManager"),
// ];
let applications = [
  <AppButton key="ApplicationSelectionPane" title="ApplicationSelection" />,
];

export const ApplicationBar = (props: any) => {
  // const [applications, setApplications] = React.useState([
  //   [<AppButton key="ApplicationSelectionPane" title="ApplicationSelection" />]
  // ]);
  const [appArray, setAppArray] = React.useState(["ApplicationSelection"]);

  const [reloaded, setReloaded] = React.useState(false);

  if (!reloaded) {
    // re load state from session
    const appsLoaded = ps.getSession("AppBarApplications");
    if (appsLoaded !== null && appsLoaded !== null) {
      buildAppsFromstore(appsLoaded.reverse(), setAppArray);
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
  return (
    <div className="applicationBar">
      {applications}
    </div>
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
  // need to make it a full map to not show labels when rendering

  // just update the existing array with a new element, might avoid redrawing
  // trigger the redraw by changing the array of app options

  applications.push(createAppButton(appName));
  return [appName].concat(existingApps);

  // const newFirstElement = [(createAppButton(appName))];
  // if (!new Map(existingApps).has(newFirstElement[0])) {
  //   const AddApp = existingApps.shift();
  //   const notWithAdd = existingApps.slice(0);
  //   const newList = [AddApp].concat([newFirstElement]).concat(notWithAdd);
  //   return newList;
  // }
};
