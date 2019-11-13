import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "./library/Button";

const menuItems = [
  <Button
    className="remove"
    key="MenuRemove"
    type="glyphiconButton"
    Text="Close Window"
    onClick={() => {
      closeWindow();
    }}
  />,
  <Button
    className="fullscreen"
    key="MenuMaximise"
    type="glyphiconButton"
    Text="Fullscreen Window"
    onClick={() => {
      maxWindow();
    }}
  />,
  <Button
    className="minus"
    key="MenuMin"
    type="glyphiconButton"
    Text="Minimise Window"
    onClick={() => {
      minWindow();
    }}
  />,
];

export const MenuBar = (props: any) => {
  const [title, setTitle] = React.useState(props.appTitle);

  const listener = "menuTitle";
  ipcRenderer.removeAllListeners(listener);
  ipcRenderer.on(listener, (event: any, value: any) => {
    setTitle(value);
  });
  return (
    <header className="menuBar">
      <div className="menuTitle">{title}</div>
      <nav className="menunav">
        <ul className="menulist">{menuItems}</ul>
      </nav>
    </header>
  );
};

function closeWindow() {
  remote.BrowserWindow.getFocusedWindow().close();
}

function maxWindow() {
  const window = remote.BrowserWindow.getFocusedWindow();
  window.isMaximized() ? window.restore() : window.maximize();
}

function minWindow() {
  remote.BrowserWindow.getFocusedWindow().minimize();
}
