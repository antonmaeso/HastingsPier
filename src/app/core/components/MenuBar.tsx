import * as React from "react";
import { MenuButton } from "./MenuButton";
import { remote } from "electron";
import Close from "../assets/close.png";
import Max from "../assets/maximise.png";
import Min from "../assets/minimise.png";

const menuItems = [
  <MenuButton
    alt="Close"
    onClick={() => {
      closeWindow();
    }}
    src={Close}
  />,
  <MenuButton
    alt="Maximise"
    onClick={() => {
      maxWindow();
    }}
    src={Max}
  />,
  <MenuButton
    alt="Minimise"
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
