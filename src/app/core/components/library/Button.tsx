import * as React from "react";

export const Button = (props: any) => {
  let button = <button onClick={props.onClick}>{props.text}</button>;
  if (props.type == "menuItem") {
    button = MenuItemButton(props);
  }
  return button;
};
function MenuItemButton(props: any) {
  return (
      <div
        className={"menubutton glyphicon glyphicon-" + props.alt}
        onClick={props.onClick}
        title={props.alt}
      />
  );
}
