import { IFrame } from "../../core/components/library/Iframe";
import { ipcRenderer, ipcMain } from "electron";
import "./style/rmDash.scss";
import React, { useState, useEffect } from "react";
import { Button } from "../../core/components/library/Button";

export const Google = (props: any) => {
  const Src = "https://stackoverflow.com/";
  const launchNewWindow = () => {
    ipcRenderer.send("NewWindow", Src);
    ipcRenderer.on("webpageLauncher", (event: any, value: any) => {
      console.log(value);
    });
  };
  return (
    <Button
      text="Load File"
      onClick={() => {
        launchNewWindow();
      }}
    />
  );
};
