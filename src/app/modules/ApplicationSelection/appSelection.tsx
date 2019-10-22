import * as React from "react";
import { appMap } from "../../core/util/ApplicationManifest";
import { AppPane } from "./components/ApplicationPane";
import "./style/appIcon.scss";
import "./style/applicationSelection.scss";

// get list of applications from util class

// const apps = [
//   <AppPane key="OctanePane" appName="Octane" description="Burn down your Octane Tasks to keep accurate track of time taken" />,
//   <AppPane key="BatManagerPane" appName="BatManager" description="Manage your bat files and have a termianl built in react" />,
// ];

export const AppSelection = (props: any) => {
  const [availible, setAvailible] = React.useState(null);

  if (availible === null) {
    setAvailible(loadOptions());
  }
  return (
    <div className="applicationWindow AppSelection">
      {availible}
    </div>
  );
};

const loadOptions = () => {
  const toReturn: JSX.Element[] = [];
  Array.from(appMap.keys()).forEach(app => {
    if (app !== "ApplicationSelection") {
      toReturn.push(<AppPane key={app + "pane"} appName={app} description={appMap.get(app).description} />);
    }
  });
  return toReturn;
};
