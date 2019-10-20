import * as React from "react";
import { Example } from "../../modules/Example/components/example";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";

// TODO: call a util class to ask which one to show.

export const ApplicationWindow = (props: any) => {
  return <div className="applicationWindow">{props.App}</div>;
};
