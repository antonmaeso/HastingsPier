import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../../../core/util/Notify";

export const AppPane = (props: any) => {
  let className = "AppPane " + props.appName;
  if (props.glyphicon !== undefined) {
    className += " " + props.glyphicon;
  }
  return (
    <div
      className={className}
      onClick={() => {
        clickApp(props.appName);
      }}
    >
      <div className="ShowOnMouseOver">{props.description}</div>
      <div className="AppPaneTitle">{props.title}</div>
    </div>
  );
};

const clickApp = (app: string) => {
  // signal to the util that an app has been clicked on
  // for now just use ipcRenderer. Extract to util when better idea of how it looks
  ipcRenderer.send("AppBar", app);
  Notify.AppNotification(app, "W");
  // Notify.setWindowTitle(app);
};
