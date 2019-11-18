import * as React from "react";
import { Button } from "../../../core/components/library/Button";

export const VideoControls = (props: any) => {
    return <div>
        <Button Text="Record" onClick={() => { props.recordFunction() }} />
        <Button Text="Stop Recording" onClick={() => { props.stopRecord() }} />
    </div>;
};
