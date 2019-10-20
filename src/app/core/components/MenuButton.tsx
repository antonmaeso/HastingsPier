import * as React from "react";
import "bootstrap";
export const MenuButton = (props: any) => {
  return (
    <li style={{ float: "right" }}>
      <div
        className={"glyphicon glyphicon-" + props.alt}
        onClick={props.onClick}
        title={props.alt}
      />
    </li>
  );
};
