import * as React from "react";
import { Story } from "./Story";

interface IProps {

}

export const Stories = (props: IProps) => {
    return <React.Fragment>
        <div>This is the container for fectching and storing stories.</div>
        <Story />
    </React.Fragment>;
};
