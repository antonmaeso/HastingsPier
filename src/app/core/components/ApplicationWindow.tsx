import * as React from "react";

// TODO: call a util class to ask which one to show.

export const ApplicationWindow = (props: any) => {

  // React.useEffect(() => {
  //   return () => { console.log(props.App + " Unmounted"); }
  // });

  return <div className="applicationWindow">{props.App}</div>;
};
