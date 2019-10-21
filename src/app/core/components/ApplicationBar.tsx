import { ipcRenderer } from "electron";
import * as React from "react";
import { Notify } from "../../core/util/Notify";
import { AppButton } from "./ApplicationButton";

const applicationHC = [
  // TODO: look this up from a util class
  <AppButton title="ApplicationSelection" />,
  <AppButton title="Octane" />,
  <AppButton title="BatManager" />,
];

export const ApplicationBar = (props: any) => {
  const [applications, setApplications] = React.useState([
    ["app", <AppButton key="ApplicationSelectionPane" title="ApplicationSelection" />]
  ]);
  const listener = "AppBar";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    if (!new Map(applications).has(value)) {
      const newList = addApplicationToBar(value, applications);
      setApplications(newList);
    }
  });
  Notify.Balloon("AppBar", applications.length + " Apps in state");
  return (
    <div className="applicationBar">
      {applications}
    </div>
  );
};

const addApplicationToBar = (appName: string, existingApps: any[]) => {
  // TODO: this is not maintaining the current condition of the notifications.
  const newFirstElement = [appName, <AppButton key={appName + "Pane"} title={appName} />];
  if (!new Map(existingApps).has(newFirstElement[0])) {
    const AddApp = existingApps.shift();
    const notWithAdd = existingApps.slice(0);
    const newList = [AddApp].concat([newFirstElement]).concat(notWithAdd);
    return newList;
  }
};
