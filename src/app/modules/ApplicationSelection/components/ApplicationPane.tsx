import { ipcRenderer } from "electron";
import * as React from "react";
import { Notify } from "../../../core/util/Notify";

export const AppPane = (props: any) => {
  return (
    <div
      className={"AppPane " + props.appName}
      onClick={() => {
        clickApp(props.appName);
      }}
    >
      <div className="ShowOnMouseOver">{props.description}</div>
      <div className="AppPaneTitle">{props.appName}</div>
    </div>
  );
};

const clickApp = (app: string) => {
  // signal to the util that an app has been clicked on
  // for now just use ipcRenderer. Extract to util when better idea of how it looks
  ipcRenderer.send("AppBar", app);
  Notify.AppNotification(app, "W");
  Notify.setWindowTitle(app);
};
