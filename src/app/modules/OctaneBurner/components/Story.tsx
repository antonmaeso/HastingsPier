import * as React from "react";
import { Tasks } from "./Tasks";

interface IProps {

}

export const Story = (props: IProps) => {
    return <React.Fragment>
        <div>Story details go here</div>
        <Tasks />
    </React.Fragment>;
}