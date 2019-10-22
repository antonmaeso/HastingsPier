import * as React from "react";

export const IFrame = (props: any) => {
    let className = "";
    if (props.MaxSize) {
        className = "fullIframe";
    }
    return <iframe className={className} src={props.Src} />;
};
