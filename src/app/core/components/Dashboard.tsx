import * as React from "react";
import "../style/style.scss";
import { MenuBar } from "./MenuBar";
import { ApplicationBar } from "./ApplicationBar";
import { ApplicationWindow } from "./ApplicationWindow";

export const Dashboard = (props: {}) => {
  return (
    <React.Fragment>
      <MenuBar />
      <ApplicationBar />
      <ApplicationWindow />
    </React.Fragment>
  );
};
