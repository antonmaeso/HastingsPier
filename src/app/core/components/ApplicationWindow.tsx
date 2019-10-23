import * as React from "react";

// TODO: call a util class to ask which one to show.

export const ApplicationWindow = (props: any) => {

  React.useEffect(() => {
    console.log("ApplicationWindow useEffect")
    return () => { console.log("ApplicationWindow Unmounted"); };
  });
  let className = "applicationWindow";
  if (props.Active !== props.Title) {
    className += " hidden";
  }

  return <div className={className}>{props.App}</div>;
};
