import * as React from "react";

export const Button = (props: any) => {
  let button = <button onClick={props.onClick}>{props.text}</button>;
  if (props.type == "image") {
    button = ImageButton(props);
  }
  return button;
};
function ImageButton(props: any) {
  return (
    <div
      className={"menuItems glyphicon glyphicon-" + props.alt}
      onClick={props.onClick}
      title={props.alt}
    />
  );
}
