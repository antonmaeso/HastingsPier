import * as React from "react";
import { TextInput } from "../../../core/components/library/TextInput";
import { BaseUrl } from "../OctaneParent";
import { Stories } from "./Stories";
import { Get } from "../../../core/util/classes/HttpRequest";
import { string } from "prop-types";

interface IProps {
    allUsers: Map<string, any>;
    userId: string;
    username: string;
    workspaceId: string;

}

// This component is the main display component for the loaded octane bits.

// Add a search bar to look for specific Story/task/Defect and add it to the displayed stories?
// Store info in local session so that when Octane can not be accessed, could look at cached info?

// Fetch all tasks linked to the user.
// Use them to get all the associated stories
// Group Tasks by story
// Pass the stories to Stories
// Have a refresh tasks function which can be linked to a button and on a timer
// use effect hooks to update based on new tasks and stories

export const OctaneMain = (props: IProps) => {
    const [UserTasks, setUserTasks] = React.useState([]);
    const [stories, setStories] = React.useState([]);
    const [groupedStories, setGroupedStories] = React.useState(new Map<string, any>());
    const [allTasks, setAllTasks] = React.useState(new Map<string, any>());
    let TotalNumberOfTasks: number;

    const getAllTasks = (response?: any, offset?: string, currentTasks?: []) => {
        // get all the tasks but just with owner details and phase
        let url = BaseUrl + props.workspaceId + "/tasks?fields=owner,phase&limit=9000";
        if (offset !== undefined && offset !== null) {
            url = url + "&offset=" + offset;
        }
        if (currentTasks === null || currentTasks === undefined) {
            currentTasks = [];
        }
        if (response === undefined || response === null) {
            Get(url, getAllTasks, offset, currentTasks);
        } else {
            const responseObject = JSON.parse(response.responseText);
            const totalNumberOfTasks = responseObject.total_count;
            const newList = currentTasks.concat(responseObject.data);
            // pass the number of tasks so it knows when its done
            if (offset === null || offset === undefined) {// so its only sends on the first call.
                TotalNumberOfTasks = totalNumberOfTasks;
            }

            if (responseObject.data != null) {
                // need to run the API call again and offset the results by 9000 to get the next set of tasks
                if (offset === undefined || offset === null) {
                    offset = "0";
                }
                if (Number(totalNumberOfTasks) > (Number(offset) + responseObject.data.length)) {
                    offset = String(Number(offset) + 9000);
                    getAllTasks(null, offset, newList);
                } else {
                    // all tasks have been loaded so filter them now
                    filterTasks(newList);
                }
            }
        }
    };

    const filterTasks = (taskObjects: any) => {
        for (const task of taskObjects) {
            const owner = task.owner;
            if (!allTasks.has(task.id)) {
                allTasks.set(task.id, task);
                if (owner != null) {
                    const ownerId = owner.id;
                    if ((ownerId === props.userId) && !UserTasks.includes(task.id) && (task.phase.id !== "phase.task.completed")) {
                        UserTasks.push(task.id);
                    }
                }
            }
        }
        if (allTasks.size >= TotalNumberOfTasks) {
            UserTasks.forEach((taskId) => {
                getTaskDetails(null, taskId);
            });

        }
    };

    const getTaskDetails = (response: any, taskId: string) => {
        const url = BaseUrl + props.workspaceId + "/tasks/" + taskId + "?fields=author,description,estimated_hours,invested_hours,last_modified,name,phase,remaining_hours,story";
        if (response === null || response === undefined) {
            Get(url, getTaskDetails, taskId);
        } else {
            // pull out task details in this api then pass the details to util for storage. To save on rendering time
            const taskToAdd = JSON.parse(response.responseText);

        }
    };

    if (UserTasks.length === 0 && props.userId !== "" && props.workspaceId !== "") {
        getAllTasks();
    }

    return <React.Fragment>
        <div>Octane Main</div>
        <TextInput Placeholder="Search For A Story" />
        <Stories />
    </React.Fragment>;
};

