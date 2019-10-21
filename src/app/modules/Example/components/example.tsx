import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "../../../core/components/library/Button";
import { Notify } from "../../../core/Util/Notify";
import "../style/exampleStyle.scss";

export const Example = (props: any) => {
  const [count, setCount] = React.useState(0);
  const [apps, setApps] = React.useState({});

  const listener = "appsResponse";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    setApps(value);
  });

  return (
    <div className="applicationWindow Example">
      EXAMPLE
      <Button
        text="Load File"
        onClick={() => {
          ipcRenderer.send("apps");
        }}
      />
      <br></br>
      <Button
        text="Send Notification"
        onClick={() => {
          setCount(count + 1);
          Notify.AppNotification("Octane", count.toString());
          // ipcRenderer.send("notify", { notify: count, App: "Octane" });
        }}
      />
    </div>
  );
};
