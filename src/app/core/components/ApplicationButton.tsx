import { ipcRenderer } from "electron";
import * as React from "react";
import { Notify } from "../util/Notify";

export const AppButton = (props: any) => {
  const [notification, setNotification] = React.useState("0");
  const [active, setActive] = React.useState(false);
  const [listeners, setListeners] = React.useState(false);

  if (!listeners) {
    setupListeners(props, setNotification, setActive);
    setListeners(true);
  }

  let className = "appButton " + props.title;
  if (active) {
    className += " activeApp";
  }

  return (
    <div className={className}
      title={props.title}
      onClick={() => {
        Notify.setWindowTitle(props.title);
        Notify.setActiveApplication(props.title);
      }}>
      <div className="notify">{notification}</div>
    </div>
  );
};

function setupListeners(props: any,
  setNotification: React.Dispatch<React.SetStateAction<string>>,
  setActive: React.Dispatch<React.SetStateAction<boolean>>) {

  ipcRenderer.on("notify" + props.title, (event: any, value: any) => {
    setNotification(value);
  });
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    setActive((value === props.title));
  });
}
