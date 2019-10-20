import * as React from "react";
import "./style/applicationSelection.scss";
import "./style/appIcon.scss"
import { Button } from "../../core/components/library/Button";
import { ipcRenderer } from "electron";
import { AppPane } from "./components/ApplicationPane";

// get list of applications from util class

const apps = [
  <AppPane key="OctanePane" appName = "Octane" description="Burn down your Octane Tasks to keep accurate track of time taken"/>,
  <AppPane key="BatManagerPane" appName = "BatManager" description ="Manage your bat files and have a termianl built in react"/>
]

export const AppSelection = (props: any) => {

  return (
    <div className="applicationWindow AppSelection">
      <br></br>
      {apps}
    </div>
  );
};

