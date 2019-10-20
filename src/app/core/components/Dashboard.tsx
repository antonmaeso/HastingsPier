import * as React from "react";
import "../style/style.scss";
import { MenuBar } from "./MenuBar";
import { ApplicationBar } from "./ApplicationBar";
import { ApplicationWindow } from "./ApplicationWindow";
import {AppSelection} from "../../modules/ApplicationSelection/appSelection";

// TODO: Util class which passes the required application to the
// Application Window for rendering

export const Dashboard = (props: any) => {
const [RunningApplication, setRunningApplication] = React.useState(<AppSelection/>)

  return (
    <div className="coreApplication">
      <div className="application">
        <MenuBar appTitle="Hastings Pier" />
      </div>
      <div className="application">
        <ApplicationBar />
        <ApplicationWindow App = {RunningApplication}/>
      </div>
    </div>
  );
};


