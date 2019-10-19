import * as React from "react";
import { MenuButton } from "./MenuButton";

export const MenuBar = (props: any) => {    
  return <div className="menuBar">
  Menu Bar
  {makeMenuButton("Maximise")}
  </div>;
};

function makeMenuButton(details: any) {
  return <MenuButton text = {details}/>;
}
