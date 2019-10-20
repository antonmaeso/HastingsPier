import * as React from "react";
import { remote } from "electron";
import { Button } from "./library/Button";

const menuItems = [
  <Button
    alt="remove"
    type="menuItem"
    onClick={() => {
      closeWindow();
    }}
  />,
  <Button
    alt="fullscreen"
    type="menuItem"
    onClick={() => {
      maxWindow();
    }}
  />,
  <Button
    alt="minus"
    type="menuItem"
    onClick={() => {
      minWindow();
    }}
  />
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
