import * as React from "react";

export const AppButton = (props: any) => {
  return (
    <div className={"appButton " + props.title} title={props.title}>
    </div>
  );
};
