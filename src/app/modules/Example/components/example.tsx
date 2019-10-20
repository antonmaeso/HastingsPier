import * as React from "react";
import "../style/exampleStyle.scss";
import { Button } from "../../../core/components/library/Button";
import { ipcRenderer, remote } from "electron";
import { readJsonFile } from "../../../core/util/FileLoader";

export const Example = (props: any) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="applicationWindow Example">
      EXAMPLE
      <Button
        text="Load File"
        onClick={() => {
          readJsonFile();
        }}
      />
      <br></br>
      <Button
        text="Send Notification"
        onClick={() => {
          setCount(count + 1);
          ipcRenderer.send("notify", { notify: count, App: "Octane" });
        }}
      />
    </div>
  );
};
