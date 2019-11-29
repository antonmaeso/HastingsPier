import { ipcRenderer } from "electron";
import * as React from "react";
import * as ps from "../util/PersistantStorage";
const WindowId = require('electron').remote.getCurrentWindow().id;

// TODO: call a util class to ask which one to show.

interface IProps {
  identifier: string;
  App: JSX.Element;
}

export const ApplicationWindow = (props: IProps) => {
  const [display, setDisplay] = React.useState(true);
  const [listener, setListeners] = React.useState(false);

  if (!listener) {
    setupListeners(setDisplay, props.identifier);
    setListeners(true);
  }
  const [reloaded, setReloaded] = React.useState(false);
  if (!reloaded) {
    const loaded = ps.getSession("AppWindow" + props.identifier + WindowId);
    if (loaded !== undefined && loaded !== null) {
      setDisplay(loaded);
    }
    setReloaded(true);
  }

  React.useEffect(() => {
    console.log("ApplicationWindow useEffect");
    return () => {
      ipcRenderer.removeAllListeners("activeApplication" + props.identifier);
    };
  }, []);
  let className = "applicationWindow";
  if (!display) {
    className += " hidden";
  } else if (display) {
    className += " active";
  }

  return <div className={className}>{props.App}</div>;
};

const saveStateToSession = (display: boolean, identifier: string) => {
  ps.putSession("AppWindow" + identifier + WindowId, display);
};

const setupListeners = (setDisplay: React.Dispatch<React.SetStateAction<boolean>>, identifier: string) => {
  console.log("ApplicationWindow Creating listeners: ActiveApplication");
  ipcRenderer.on("activeApplication" + identifier, (event: any, value: any) => {
    if (value !== undefined) {
      const show = (value === identifier);
      setDisplay(show);
      saveStateToSession(show, identifier);
    }
  });
};
