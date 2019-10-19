import * as React from "react";

export const MenuButton = (props: any) => {
  return (
    <li style={{float:"right"}}>
      <input
        className="menubutton"
        type="image"
        onClick={props.onClick}
        title={props.alt}
        alt={props.alt}
        src={props.src}
      />
    </li>
  );
};
