import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "../../core/components/library/Button";
import * as Notify from "../../core/util/Notify";
import * as ps from "../../core/util/PersistantStorage";
import "./style/exampleStyle.scss";
import { Kid } from "./components/exampleChild";
import { appMap } from "../../core/util/ApplicationManifest";

export const Example = (props: any) => {
  const [count, setCount] = React.useState(0);
  const [apps, setApps] = React.useState({});
  const [local, setLocal] = React.useState(0);
  const [session, setSession] = React.useState(0);
  const [kidText, setKidText] = React.useState("Milky bar");
  const [hiddenListenerText, setHiddenListenerText] = React.useState("Og");

  const listener = "appsResponse";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    setApps(value);
  });

  // reLoad state
  const [reloaded, setReloaded] = React.useState(false);
  if (!reloaded) {
    setLocal(ps.getLocal("noteCount"));
    setReloaded(true);
  }

  return (
    <div className="applicationWindow Example">
      EXAMPLE<br></br>
      <Button
        Text="Load File"
        onClick={() => {
          ipcRenderer.send("apps");
        }}
      />
      <br></br>
      <Button
        Text={"Send Notification" + count.toString()}
        onClick={() => {
          setCount(count + 1);
          Notify.AppNotification("Octane", " this is a long notification string: " + (count + 1).toString());
          // ipcRenderer.send("notify", { notify: count, App: "Octane" });
        }}
      />
      <br></br>
      <Button
        Text="Send Balloon of click count"
        onClick={() => {
          Notify.Balloon("Example", count.toString());
        }} />
      <br></br>
      <Button
        Text={"Save Count in local"}
        onClick={() => {
          ps.putLocal("noteCount", count);
        }}
      />
      <Button
        Text={"Return Count from local"}
        onClick={() => {
          setLocal(ps.getLocal("noteCount"));
        }}
      />
      <div>Local stored Count: {local}</div>
      <Button
        Text={"Save Count in Session"}
        onClick={() => {
          ps.putLocal("noteCountSes", count);
        }}
      />
      <Button
        Text={"Return Count from Session"}
        onClick={() => {
          setSession(ps.getLocal("noteCountSes"));
        }}
      />
      <div>Local stored Count: {session}</div>
      <Button
        Text={"Save Array in local"}
        onClick={() => {
          ps.putLocal("noteCountArray", [count, count, count]);
        }}
      />
      <Button
        Text={"Return Array from local"}
        onClick={() => {
          const returned = ps.getLocal("noteCountArray");
        }}
      />
      <Button
        Text={"Save Map in local"}
        onClick={() => {
          const toStore = new Map<string, number>();
          toStore.set("1", count);
          toStore.set("2", count);
          toStore.set("3", count);
          ps.putLocal("noteCountMap", Array.from(toStore));
        }}
      />
      <Button
        Text={"Return Map from local"}
        onClick={() => {
          const returned = new Map(ps.getLocal("noteCountMap"));
        }}
      />
      <br></br>
      <Button
        Text="Send to main external class"
        onClick={() => {
          ipcRenderer.send("SeperateClass");
        }} />
      <br></br>
      <Button
        Text="Set Second Window to specific app"
        onClick={() => {
          Notify.setActiveApplication("BatManager", 2);
          Notify.setWindowTitle("BatManager", 2);
        }} />
      <br></br>
      <Button
        Text="Change props in child"
        onClick={() => {
          setKidText("Bars are on me" + count);
        }} />
      <br></br>
      <Kid key="Milkybar" text={kidText} />
      <Button
        Text="Set up listener"
        onClick={() => {
          ipcRenderer.removeAllListeners("CallMe");
          ipcRenderer.on("CallMe", () => {
            Notify.Balloon("Example", "listener Called");
            setHiddenListenerText("listener Called");
          });
        }} />
      <div>{hiddenListenerText}</div>
      <br></br>
      <Button HoverText="Fixed what caused crash" Text="Crash Dashboard"
        onClick={() => {
          Notify.Balloon("crash", "Click me to crash Dashboard", "John Connor");
        }} />
      <br></br>
      <Button Text="Crash Example"
        onClick={crashComponent} />
      <br></br>
    </div>
  );
};

const crashComponent = () => {
  throw new Error("Crashing");
};
