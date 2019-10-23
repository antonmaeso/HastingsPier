import * as React from "react";
import { IFrame } from "../../core/components/library/Iframe";
import "./style/tapestry.scss";

export const Tapestry = (props: any) => {
    const Src = "http://tapestry/Pages/Home.aspx";
    return <div className="Tapestry">
        <IFrame Src={Src} MaxSize={true} />
    </div>;
};
