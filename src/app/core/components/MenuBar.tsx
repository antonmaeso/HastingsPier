import * as React from "react";
import { MenuButton } from "./MenuButton";
import { remote } from "electron";
import Close from "../assets/close.png";
import Max from "../assets/maximise.png";
import Min from "../assets/minimise.png";
import { Button } from "./library/Button";

const menuItems = [
  <Button
    alt="remove"
    type="menuItem"
    onClick={() => {
      closeWindow();
    }}
    src={Close}
  />,
  <Button
    alt="fullscreen"
    type="menuItem"
    onClick={() => {
      maxWindow();
    }}
    src={Max}
  />,
  <Button
    alt="minus"
    type="menuItem"
    onClick={() => {
      minWindow();
    }}
    src={Min}
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
