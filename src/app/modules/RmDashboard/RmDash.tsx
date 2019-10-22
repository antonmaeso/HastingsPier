import * as React from "react";
import { IFrame } from "../../core/components/library/Iframe";
import "./style/rmDash.scss";

export const RmDash = (props: any) => {
    const Src = "https://rmdashboard.network.uk.ad/";
    return <div className="RmDash">
        <IFrame Src={Src} MaxSize={true} />
    </div>;
};
