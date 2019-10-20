import * as React from "react";
import { AppButton } from "./ApplicationButton";
import { ipcRenderer } from "electron";
import { Notify } from "../../core/util/Notify";

const applicationHC = [
  // TODO: look this up from a util class
  <AppButton title="ApplicationSelection" />,
  <AppButton title="Octane" />,
  <AppButton title="BatManager" />
];

export const ApplicationBar = (props: any) => {
  const [applications, setApplications] = React.useState([
    <AppButton title="ApplicationSelection" />
  ]);
  const listener = "AppBar";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    const newList = addApplicationToBar(value, applications);
    setApplications(newList);
  });
  // Notify.Balloon("AppBar", applications.length + " Apps in state");
  return (
    <div className="applicationBar">
      Applications
      <br />
      {applications}
    </div>
  );
};

const addApplicationToBar = (appName: string, existingApps: any[]) => {
  const newList = existingApps.concat([<AppButton title={appName} />]);
  return newList;
};
