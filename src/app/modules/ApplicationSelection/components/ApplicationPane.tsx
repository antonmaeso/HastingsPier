import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../../../core/util/Notify";

interface IProps {
  appName: string;
  title: string;
  description: string;
  glyphicon?: string;
}

export const AppPane = (props: IProps) => {
  let className = "AppPane " + props.appName;
  if (props.glyphicon !== undefined) {
    className += " " + props.glyphicon;
  }
  return (
    <div
      className={className}
      onClick={() => {
        clickApp(props.appName, props.title);
      }}
    >
      <div className="ShowOnMouseOver">{props.description}</div>
      <div className="AppPaneTitle">{props.title}</div>
    </div>
  );
};

const clickApp = (App: string, Title: string) => {
  // signal to the util that an app has been clicked on
  // for now just use ipcRenderer. Extract to util when better idea of how it looks
  ipcRenderer.send("AppBar", {app: App, title: Title});
  // Notify.AppNotification(app, "W");
  // Notify.setWindowTitle(app);
};
