import { ipcRenderer } from "electron";
const { ipcMain } = require("electron").remote;
import * as React from "react";
import styled, { keyframes } from "styled-components";
import octIcon from "./../assets/octaneIcon.png";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  animation: ${rotate} 3s linear infinite;
  width: 50%;
  max-width: 400px;
  `;

const listener = "OctaneSpinnerNotification";

export const notification = (Message: string) => {
  ipcRenderer.send(listener, Message);
};

export const Spinner = (props: any) => {
  const [message, setMessage] = React.useState("");
  React.useEffect(() => {
    ipcMain.on(listener, (event: any, value: any) => {
      setMessage(value);
    });
    return () => {
      ipcMain.removeAllListeners(listener);
    };
  }, []);

  return <React.Fragment>
    <div className="OctSpinner">
      <Rotate>
        <img width="100%" src={octIcon} alt="Loading" />
      </Rotate>
      <div>{message}</div>
    </div>
  </React.Fragment>;
};
