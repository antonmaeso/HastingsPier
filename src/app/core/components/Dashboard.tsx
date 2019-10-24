import { ipcRenderer } from "electron";
import * as React from "react";
import "../style/style.scss";
import { appMap } from "../util/ApplicationManifest";
import * as ps from "../util/PersistantStorage";
import { ApplicationBar } from "./ApplicationBar";
import { ApplicationWindow } from "./ApplicationWindow";
const WindowId = require('electron').remote.getCurrentWindow().id;

// TODO: Util class which passes the required application to the
// Application Window for rendering
const loadedApps = new Map<string, JSX.Element>();

export const Dashboard = (props: any) => {
  const [RunningApplication, setRunningApplication] = React.useState(
    "ApplicationSelection",
  );
  const [listener, setListeners] = React.useState(false);
  if (!listener) {
    setupListeners(setRunningApplication);
    setListeners(true);
  }

  const [reloaded, setReloaded] = React.useState(false);
  if (!reloaded) {
    const loaded = ps.getSession("activeApplication" + WindowId);
    if (loaded !== undefined && loaded !== null) {
      setRunningApplication(loaded);
    }
    setReloaded(true);
    // request the app which should be shown
    if (WindowId !== 1) {
      ipcRenderer.send("WindowControl", { target: "activeApp", data: { windowId: WindowId } });
    }
  }

  addAppToDom(RunningApplication);

  React.useEffect(() => {
    // save state on window unmount
    return () => { // return is ~ the same as will unmount
      saveStateToSession(RunningApplication);
    };
  }, []);

  return (
    <div className="coreApplication">
      <div className="application">
        <ApplicationBar Active={RunningApplication} />
        {Array.from(loadedApps.values())}
      </div>
    </div>
  );
};

const saveStateToSession = (active: string) => {
  ps.putSession("activeApplication" + WindowId, active);
};

const setupListeners = (setRunningApplication: React.Dispatch<React.SetStateAction<string>>) => {
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    if (value !== undefined) {
      setRunningApplication(value);
      saveStateToSession(value);
      addAppToDom(value);
    }
  });
};

const resetVisible = () => {

}

const addAppToDom = (app: string) => {
  if (!Array.from(loadedApps.keys()).includes(app)) {
    const App = appMap.get(app);
    const appToDisplay = App.root;
    const appWindow = <ApplicationWindow
      key={app + "Window"}
      identifier={app}
      App={appToDisplay} />;
    loadedApps.set(app, appWindow);
  }
};
