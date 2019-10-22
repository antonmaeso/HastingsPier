import * as React from "react";
import { appMap } from "../../core/util/ApplicationManifest";
import { AppPane } from "./components/ApplicationPane";
import "./style/appIcon.scss";
import "./style/applicationSelection.scss";

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
