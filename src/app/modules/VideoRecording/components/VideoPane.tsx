import * as React from "react";

export const VideoPane = (props: any) => {
    return props.src ? <video className="VideoPane" id={props.id} controls src={props.src} /> : null;
};
