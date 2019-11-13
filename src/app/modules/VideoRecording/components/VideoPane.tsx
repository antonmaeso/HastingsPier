import * as React from "react";

export const VideoPane = (props: any) => {
    return <video id={props.id} controls src={props.src} />;
};
