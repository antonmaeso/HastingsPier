import * as React from "react";
import { Task } from "./Task";

interface IProps {

}

export const Tasks = (props: IProps) => {
    return <React.Fragment>
        <div>This is the container which is used to fetch and store the users tasks.</div>
        <Task />
    </React.Fragment>;
};
