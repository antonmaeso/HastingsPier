import { remote, ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./library/Button";

const menuItems = [
  <Button
    alt="remove"
    key="MenuRemove"
    type="menuItem"
    onClick={() => {
      closeWindow();
    }}
  />,
  <Button
    alt="fullscreen"
    key="MenuMaximise"
    type="menuItem"
    onClick={() => {
      maxWindow();
    }}
  />,
  <Button
    alt="minus"
    key="MenuMin"
    type="menuItem"
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
