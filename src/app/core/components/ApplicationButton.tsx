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

interface IProps {
  appName: string;
  title: string;
}

// const notifications: NotifyObject[] = [new NotifyObject("Nothing To See Here")];

export const AppButton = (props: IProps) => {
  const [active, setActive] = React.useState(false);
  const [listeners, setListeners] = React.useState(false);
  const [reloaded, setReloaded] = React.useState(false);
  const [notifications, setNotifications] = React.useState(new Array<NotifyObject>());

  if (!reloaded) {
    // re load state from session
    const oldNoti = ps.getSession("notify" + props.appName + WindowId);
    if (oldNoti !== undefined && oldNoti !== null) {
      setNotifications(oldNoti);
    }
    setActive((ps.getSession("activeApplication" + WindowId) === props.appName));
    setReloaded(true);
  }

  let className = "appButton " + props.appName;
  if (active) {
    className += " activeApp";
  }

  const setupListeners = () => {
    console.log("ApplicationButton Creating listeners: activeApplication");
    ipcRenderer.on("activeApplication" + props.appName, (event: any, value: any) => {
      setActive(value === props.appName);
      ps.putSession("activeApplication" + props.appName + WindowId, (value === props.appName));
    });
  };
  ipcRenderer.on("notify" + props.appName, (event: any, value: any) => {
    ipcRenderer.removeAllListeners("notify" + props.appName);
    const newNoti = notifications.concat(new NotifyObject(value));
    setNotifications(newNoti);
    ps.putSession("notify" + props.appName + WindowId, newNoti);
    Notify.Balloon(props.appName, value, props.appName);
  });

  if (!listeners) {
    setupListeners();
    setListeners(true);
  }

  React.useEffect(() => {
    return () => { // return is the same as will unmount
      ipcRenderer.removeAllListeners("activeApplication" + props.appName);
      ipcRenderer.removeAllListeners("notify" + props.appName);
    };
  }, []);

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
        }}
      // onContextMenu={() => { rightClick(props.appName); }}
      >
        {notifications.length > 0 ?
          <React.Fragment>
            <div className="notifyCount" title={(notifications.length).toString()}>{notifications.length}</div>
            <ButtonNotification
              appName={props.appName}
              notifications={notifications} />
          </React.Fragment> : null
        }
      </div>
    </React.Fragment>
  );
};

const rightClick = (AppToShow: string) => {
  // open app in new window
  ipcRenderer.send("WindowControl", { target: "createWindow", data: { appToShow: AppToShow } });
};

const closeApp = (appToClose: string) => {
  ipcRenderer.removeAllListeners("activeApplication" + appToClose);
  Notify.closeApplication(appToClose);
};
