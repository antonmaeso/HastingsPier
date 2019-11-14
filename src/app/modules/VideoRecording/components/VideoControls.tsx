import * as React from "react";
import { Button } from "../../../core/components/library/Button";

export const VideoControls = (props: any) => {
    return <Button Text={props.text} onClick={props.onClick}/>;
};
