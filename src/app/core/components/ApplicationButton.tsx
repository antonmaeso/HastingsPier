import { ipcRenderer } from "electron";
import * as React from "react";
import * as Notify from "../util/Notify";
import * as ps from "../util/PersistantStorage";
import { ButtonNotification } from "./AppButtonNotification";
const WindowId = require("electron").remote.getCurrentWindow().id;

export class NotifyObject {
  public notification: string;
  public read = false;

  constructor(info: string) {
    this.notification = info;
  }
}

const notifications: NotifyObject[] = [new NotifyObject("Nothing To See Here")];

export const AppButton = (props: any) => {
  const [notification, setNotification] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [listeners, setListeners] = React.useState(false);
  const [reloaded, setReloaded] = React.useState(false);

  if (!reloaded) {
    // re load state from session
    const oldNotes = ps.getSession("notify" + props.appName + WindowId);
    if (oldNotes !== undefined && oldNotes !== null) {
      setNotification(oldNotes);
    }
    setActive((ps.getSession("activeApplication" + WindowId) === props.appName));
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
    <React.Fragment>
      {props.appName === "ApplicationSelection" ? null :
        <div className="closeApp glyphicon glyphicon-remove" title={"Remove Application"}
          onClick={() => { closeApp(props.appName); }}></div>
      }
      <div
        className={className}
        title={props.title}
        onClick={() => {
          Notify.setWindowTitle(props.title);
          Notify.setActiveApplication(props.appName);
          setNotification(false);
        }}
        onContextMenu={() => { rightClick(props.appName); }}
      >
        <div className="notifyCount" title={notifications.length.toString()}>{notifications.length}</div>
        <ButtonNotification appName={props.appName} notifications={notifications} setRead={setNotification} />
      </div>
    </React.Fragment>
  );
};

const rightClick = (AppToShow: string) => {
  // open app in new window
  ipcRenderer.send("WindowControl", { target: "createWindow", data: { appToShow: AppToShow } });
};

const closeApp = (appToClose: string) => {
  Notify.closeApplication(appToClose);
};

const setupListeners = (
  props: any,
  setNotification: React.Dispatch<React.SetStateAction<boolean>>,
  setActive: React.Dispatch<React.SetStateAction<boolean>>) => {
  console.log("ApplicationButton Creating listeners: notify"+props.appName+", activeApplication");
  ipcRenderer.removeAllListeners("notify" + props.appName);
  ipcRenderer.on("notify" + props.appName, (event: any, value: any) => {
    setNotification(true);
    ps.putSession("notify" + props.appName + WindowId, value);
    Notify.Balloon(props.appName, value, props.appName);
  });
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    setActive(value === props.appName);
    ps.putSession("activeApplication" + props.appName + WindowId, (value === props.appName));
  });
};
