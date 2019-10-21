import * as React from "react";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";
import { Example } from "../../modules/Example/components/example";
import "../style/style.scss";
import { ApplicationBar } from "./ApplicationBar";
import { ApplicationWindow } from "./ApplicationWindow";
import { MenuBar } from "./MenuBar";

// TODO: Util class which passes the required application to the
// Application Window for rendering

export const Dashboard = (props: any) => {
  const [RunningApplication, setRunningApplication] = React.useState(
    <AppSelection />,
  );

  return (
    <div className="coreApplication">
      <div className="application">
        <ApplicationBar />
        <ApplicationWindow App={RunningApplication} />
      </div>
    </div>
  );
};
