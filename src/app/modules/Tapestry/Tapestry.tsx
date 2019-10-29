import * as React from "react";
import { Webview } from "../../core/components/library/Webview";
import "./style/tapestry.scss";

export const Tapestry = (props: any) => {
    const Src = "http://tapestry/Pages/Home.aspx";
    return <div className="Tapestry">
        <Webview Src={Src} MaxSize={true} />
    </div>;
};
