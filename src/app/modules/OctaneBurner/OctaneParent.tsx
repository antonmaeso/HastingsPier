import { ipcRenderer, remote } from "electron";
import * as React from "react";

export const OctaneParent = (props: any) => {

  return (
    <div className="applicationWindow">
      <button onClick={()=>{
        ipcRenderer.send("CallMe");
      }}>Click to send message</button>
    </div>
  );
};
