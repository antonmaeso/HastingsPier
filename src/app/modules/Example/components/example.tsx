import * as React from "react";
import "../style/exampleStyle.scss";
import "../style/appIcons.scss"
import { Button } from "../../../core/components/library/Button";
import { ipcRenderer } from "electron";

export const Example = (props: any) => {
  const[count, setCount] = React.useState(0);

  return (
    <div className="applicationWindow Example">
      EXAMPLE
      <br></br>      
      <Button text="Send Notification" onClick={()=>{
        setCount(count+1);
        ipcRenderer.send("notify",{notify:count,App:"Octane"})
      }}/>
    </div>
  );
};

