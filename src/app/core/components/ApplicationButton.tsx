import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../util/Notify";
import * as ps from "../util/PersistantStorage";

export const AppButton = (props: any) => {
  const [notification, setNotification] = React.useState("0");
  const [active, setActive] = React.useState(false);
  const [listeners, setListeners] = React.useState(false);
  const [reloaded, setReloaded] = React.useState(false);

  if (!reloaded) {
    // re load state from session
    const oldNotes = ps.getSession("notify" + props.appName);
    if (oldNotes !== undefined && oldNotes !== null) {
      setNotification(oldNotes);
    }
    setActive((ps.getSession("activeApplication") === props.appName));
    setReloaded(true);
  }

  if (!listeners) {
    setupListeners(props, setNotification, setActive);
    setListeners(true);
  }

  let className = "appButton " + props.title;
  if (active) {
    className += " activeApp";
  }

  // React.useEffect(() => {
  //   // save state on window close/refresh/unmount
  //   window.addEventListener("beforeunload", () => { saveStateToSession(props, notification, active);});
  //   return () => { // return is the same as will unmount
  //     saveStateToSession(props, notification, active);
  //     window.removeEventListener("beforeunload", () => { saveStateToSession(props, notification, active); });
  //   };
  // }, []);

  return (
    <div
      className={className}
      title={props.title}
      onClick={() => {
        Notify.setWindowTitle(props.title);
        Notify.setActiveApplication(props.appName);
        setNotification("");
      }}
      onContextMenu={() => { rightClick(props.appName); }}
    >
      <div className="notify">{notification}</div>
    </div>
  );
};

const rightClick = (AppToShow: string) => {
  // open app in new window
  ipcRenderer.send("WindowControl", { target: "createWindow", data: { appToShow: AppToShow } });
};

const setupListeners = (
  props: any,
  setNotification: React.Dispatch<React.SetStateAction<string>>,
  setActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ipcRenderer.removeAllListeners("notify" + props.appName);
  ipcRenderer.on("notify" + props.appName, (event: any, value: any) => {
    setNotification(value);
    ps.putSession("notify" + props.appName, value);
  });
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    setActive(value === props.appName);
    ps.putSession("activeApplication" + props.appName, (value === props.appName));
  });
}
