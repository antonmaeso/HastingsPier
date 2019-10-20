import * as React from "react";

export const AppPane = (props: any) => {
  return (
    <div className={"AppPane " + props.appName}>
      {props.appName}
      <div className="ShowOnMouseOver">{props.description}</div>
    </div>
  );
};

const clickApp = (app: string) =>{
    //signal to the util that an app has been clicked on
}
