import * as React from "react";
import { ipcRenderer } from "electron";

export const AppButton = (props: any) => {
  const[notification, setNotification] = React.useState("0");

  ipcRenderer.removeAllListeners("notify"+props.title);
  ipcRenderer.on("notify"+ props.title,(event: any, value: any)=>{
    setNotification(value);
  })

  return (
    <div className={"appButton " + props.title} title={props.title}>
      <div className="notify">{notification}</div>  
    </div>
  );
};

