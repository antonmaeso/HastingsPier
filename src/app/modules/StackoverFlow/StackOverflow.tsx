import { IFrame } from "../../core/components/library/Iframe";
import { ipcRenderer, ipcMain } from "electron";
import "./style/rmDash.scss";
import React, { useState, useEffect } from "react";
import { Button } from "../../core/components/library/Button";
import {
  DataHandler,
  DataSource,
  CRUD,
  WebRequest
} from "../../core/util/DataHandler";

export const Google = (props: any) => {
  const Src = "https://stackoverflow.com/";
  const launchNewWindow = () => {
    ipcRenderer.send("NewWindow", Src);
    ipcRenderer.on("webpageLauncher", (event: any, value: any) => {
      checkElementOnWindowHasClas("", "bg-orange-400", value);
    });
  };
  const checkElementOnWindowHasClas = (
    elementId: string,
    classToFind: string,
    windowId: string
  ) => {
    ipcRenderer.send("NewWindow", {
      elementId: elementId,
      classToFind: classToFind,
      windowId: windowId
    });
  };

  const readFile = () => {
    let config: CRUD = new DataHandler(DataSource.FILE);
    console.log(config.read("/dist/HastingsPier.json"));
  };

  const webRequest = () => {
    let test: WebRequest = new DataHandler(DataSource.FILE);
    test
      .get("https://jsonplaceholder.typicode.com/todos")
      .then(result => console.log(result));
  };
  return (
    <React.Fragment>
      <Button
        text="Load File"
        onClick={() => {
          launchNewWindow();
        }}
      />
      <Button
        text="Check element on window"
        onClick={() => {
          checkElementOnWindowHasClas("", "", "");
        }}
      />
      <Button
        text="test File reader"
        onClick={() => {
          readFile();
        }}
      />
      <Button
        text="web request reader"
        onClick={() => {
          webRequest();
        }}
      />
    </React.Fragment>
  );
};
