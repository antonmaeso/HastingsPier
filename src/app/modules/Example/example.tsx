import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "../../core/components/library/Button";
import * as Notify from "../../core/util/Notify";
import * as ps from "../../core/util/PersistantStorage";
import "./style/exampleStyle.scss";

export const Example = (props: any) => {
  const [count, setCount] = React.useState(0);
  const [apps, setApps] = React.useState({});
  const [local, setLocal] = React.useState(0);
  const [session, setSession] = React.useState(0);

  const listener = "appsResponse";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    setApps(value);
  });

  //reLoad state
  const [reloaded, setReloaded] = React.useState(false);
  if (!reloaded) {
    setLocal(ps.getLocal("noteCount"));
    setReloaded(true);
  }

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
          Notify.AppNotification("Octane", (count + 1).toString());
          // ipcRenderer.send("notify", { notify: count, App: "Octane" });
        }}
      />
      <br></br>
      <Button
        text={"Save Count in local"}
        onClick={() => {
          ps.putLocal("noteCount", count);
        }}
      />
      <Button
        text={"Return Count from local"}
        onClick={() => {
          setLocal(ps.getLocal("noteCount"));
        }}
      />
      <div>Local stored Count: {local}</div>
      <Button
        text={"Save Count in Session"}
        onClick={() => {
          ps.putLocal("noteCountSes", count);
        }}
      />
      <Button
        text={"Return Count from Session"}
        onClick={() => {
          setSession(ps.getLocal("noteCountSes"));
        }}
      />
      <div>Local stored Count: {session}</div>
      <Button
        text={"Save Array in local"}
        onClick={() => {
          ps.putLocal("noteCountArray", [count, count, count]);
        }}
      />
      <Button
        text={"Return Array from local"}
        onClick={() => {
          const returned = ps.getLocal("noteCountArray");
        }}
      />
      <Button
        text={"Save Map in local"}
        onClick={() => {
          const toStore = new Map<string, number>();
          toStore.set("1", count);
          toStore.set("2", count);
          toStore.set("3", count);
          ps.putLocal("noteCountMap", Array.from(toStore));
        }}
      />
      <Button
        text={"Return Map from local"}
        onClick={() => {
          const returned = new Map(ps.getLocal("noteCountMap"));
        }}
      />
      <br></br>
      <Button
        text="Send to main external class"
        onClick={() => {
          ipcRenderer.send("SeperateClass");
        }} />
      <br></br>
    </div>
  );
};
