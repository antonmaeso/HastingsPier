import * as React from "react";
import "../style/exampleStyle.scss";
import "../style/appIcons.scss"
import { Button } from "../../../core/components/library/Button";
import { ipcRenderer, remote } from "electron";

export const Example = (props: any) => {
  return (
    <div className="applicationWindow Example">
      EXAMPLE
      <br></br>      
      <Button text="Send Notification" onClick={()=>{sendNotification()}}/>
    </div>
  );
};

function sendNotification(){
  remote.BrowserWindow.getFocusedWindow().minimize();
  ipcRenderer.send("notify",{notify:"10"})
}
