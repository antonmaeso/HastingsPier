import { ipcRenderer } from "electron";
import * as React from "react";
import "../style/style.scss";
import { appMap } from "../util/ApplicationManifest";
import * as N from "../util/Notify";
import * as ps from "../util/PersistantStorage";
import * as BV from "../util/BrowserViewUtil";
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
  console.log("Dashboard Creating listeners: ActiveApplication, closeApplication");
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    if (value !== undefined) {
      setRunningApplication(value);
      saveStateToSession(value);
      addAppToDom(value);
    }
  });
  ipcRenderer.on("closeApplication", (event: any, value: any) => {
    removeAppFromDom(value.Close);
    if (value.Close === value.Active) {
      const RunningApplication = "ApplicationSelection";
      N.setActiveApplication(RunningApplication);
      N.setWindowTitle(RunningApplication);
    }
  });
};

const removeAppFromDom = (app: string) => {
  loadedApps.delete(app); // need something to refresh the page
  // if its a browser window, destroy it
  BV.closeView(app);
  console.log(app + " Removed from Map: " + !(loadedApps.has(app)));
};

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
