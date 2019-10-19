import * as React from "react";

export const MenuButton = (props: any) => {
  return (
    <li style={{float:"right"}}>
      <div
        className={"experiment "+props.alt}
        onClick={props.onClick}
        title={props.alt}
      />
    </li>
  );
};
