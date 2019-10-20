import * as React from "react";
import { AppButton } from "./ApplicationButton";

const applications = [
  <AppButton title="ApplicationSelection"/>,
  <AppButton title="Octane"/>,
  <AppButton title="BatManager"/>
]

export const ApplicationBar = (props: any) => {
  return <div className="applicationBar">
  Applications
  <br/>
  {applications}
  </div>;
};
