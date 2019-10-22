import * as React from "react";
import { IFrame } from "../../core/components/library/Iframe";
import "./style/tapestry.scss";

export const Tapestry = (props: any) => {
    const Src = "https://forum.pimaxvr.com/c/pimax-8k-Series";
    return <div className="Tapestry">
        <IFrame Src={Src} MaxSize={true} />
    </div>;
};
