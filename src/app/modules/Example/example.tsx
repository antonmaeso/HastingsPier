import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "../../core/components/library/Button";
import { Notify } from "../../core/Util/Notify";
import "./style/exampleStyle.scss";
import {PersistantStore as ps} from "../../core/util/PersistantStorage";

export const Example = (props: any) => {
  const [count, setCount] = React.useState(0);
  const [apps, setApps] = React.useState({});
  const [local, setLocal] = React.useState(0);

  const listener = "appsResponse";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    setApps(value);
  });

  return (
    <div className="applicationWindow Example">
      EXAMPLE<br></br>
      <Button
        text="Load File"
        onClick={() => {
          ipcRenderer.send("apps");
        }}
      />
      <br></br>
      <Button
        text={"Send Notification" + count.toString()}
        onClick={() => {
          setCount(count + 1);
          Notify.AppNotification("Octane", (count+1).toString());
          // ipcRenderer.send("notify", { notify: count, App: "Octane" });
        }}
      />
      <br></br>
      <Button
        text={"Save Count in local"}
        onClick={() => {
          ps.putLocal("noteCount",count);
        }}
      />
      <Button
        text={"Return Count from local"}
        onClick={() => {
          setLocal(ps.getLocal("noteCount"));
        }}
      /><div>Local stored Count: {local}</div>
      <Button
        text={"Save Array in local"}
        onClick={() => {
          ps.putLocal("noteCountArray",[count,count,count]);
        }}
      />
      <Button
        text={"Return Array from local"}
        onClick={() => {
          const returned = ps.getLocal("noteCountArray");
        }}
      />
      </div>
  );
};
