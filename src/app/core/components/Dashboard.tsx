import * as React from "react";
import { ApplicationWindow } from "./ApplicationWindow";
import { MenuBar } from "./Menu";
import { ApplicationBar } from "./ApplicationBar";

export const Dashboard = () => {
  return (
    <React.Fragment>
      <MenuBar />
      <ApplicationBar />
      <ApplicationWindow />
    </React.Fragment>
  );
};
