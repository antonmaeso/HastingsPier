import { remote } from "electron";
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
  return (
    <header className="menuBar">
      {props.appTitle}
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
