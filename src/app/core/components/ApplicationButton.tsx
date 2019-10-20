import * as React from "react";
import { ipcRenderer } from "electron";

export const AppButton = (props: any) => {
  const[notification, setNotification] = React.useState("0");

  ipcRenderer.on("notify",(event: any, value: any)=>{
    setNotification(value.notify);
  })

  return (
    <div className={"appButton " + props.title} title={props.title}>
      <div className="notify">{notification}</div>  
    </div>
  );
};

