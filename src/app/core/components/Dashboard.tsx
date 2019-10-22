import { ipcRenderer } from "electron";
import * as React from "react";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";
import { Example } from "../../modules/Example/example";
import { OctaneParent } from "../../modules/OctaneBurner/OctaneParent";
import "../style/style.scss";
import { ApplicationBar } from "./ApplicationBar";
import { ApplicationWindow } from "./ApplicationWindow";
import { PersistantStore as ps } from "../util/PersistantStorage";

// TODO: Util class which passes the required application to the
// Application Window for rendering

const appMap = new Map<string, JSX.Element>();
appMap.set("ApplicationSelection", <AppSelection />);
appMap.set("Octane", <OctaneParent />);
appMap.set("BatManager", <Example />);


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
    const loaded = ps.getSession("activeApplication");
    if (loaded !== undefined && loaded !== null) {
      setRunningApplication(loaded);
    }
    setReloaded(true);
  }

  React.useEffect(() => {
    // save state on window unmount
    return () => { // return is the same as will unmount
      saveStateToSession(RunningApplication);
    };
  }, []);


  return (
    <div className="coreApplication">
      <div className="application">
        <ApplicationBar />
        <ApplicationWindow App={appMap.get(RunningApplication)} />
      </div>
    </div>
  );
};

const saveStateToSession = (active: string) => {
  ps.putSession("activeApplication", active);
};

const setupListeners = (setRunningApplication: React.Dispatch<React.SetStateAction<string>>) => {
  ipcRenderer.on("activeApplication", (event: any, value: any) => {
    setRunningApplication(value);
    saveStateToSession(value);
  });
};
