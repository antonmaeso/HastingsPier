import { ipcRenderer } from "electron";

const urlStart = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/";

export class ApiUtil {

    // -----------------------------get octane details ------------------------------
    public static getWorkspaceId(response: any) {
        ApiUtil.Log("getWorkspaceId");
        const url = urlStart;
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getWorkspaceId);
        } else {
            // check status
            if (response.status !== 200) {
                // login has failed, try again
                const arg = { source: "workspaceFail", data: { fail: true } };
                ipcRenderer.send("internal", arg);
            } else {
                // pull out id
                const id = JSON.parse(response.responseText).data[0].id;
                ipcRenderer.send("tsUtil",
                    { target: "details", data: { target: "update", property: "WorkspaceId", value: id } });
                const arg = { source: "workspaceSuccess", data: { workspaceId: id } };
                ipcRenderer.send("internal", arg);
            }
        }
    }

    public static getUserId(response: any, listener: string) {
        ApiUtil.Log("getUserId");
        const url = urlStart + "1002/workspace_users";
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getUserId, listener);
        } else {
            // pass response to util to pull out the desired ID
            const Data = { target: "findUserId", data: response.responseText };
            ipcRenderer.send("tsUtil", { source: listener, target: "user", data: Data });
        }
    }

    public static getAllTasks(response: any, userId?: string, offset?: string, currentTasks?: []) {
        ApiUtil.Log("getAllTasks");
        // get all the tasks but just with owner details and phase
        let url = urlStart + "1002/tasks?fields=owner,phase&limit=9000";
        if (offset !== undefined && offset !== null) {
            url = url + "&offset=" + offset;
        }
        if (currentTasks === null || currentTasks === undefined) {
            currentTasks = [];
        }
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getAllTasks, userId, offset, currentTasks);
        } else {
            // Pull out all the tasks with the user as the owner.
            // pass that info the util and then start getting full details for each task
            // pass the full details to util where it can save them.
            // fetch each task detail from util
            const responseObject = JSON.parse(response.responseText);
            const totalNumberOfTasks = responseObject.total_count;
            const newList = currentTasks.concat(responseObject.data);
            // pass the number of tasks to util so it can signal when its done
            if (offset === null || offset === undefined) {// so its only sends on the first call.
                const Data = { target: "totalNumberOfTasks", data: totalNumberOfTasks };
                ipcRenderer.send("tsUtil", { source: "allTasks", target: "task", data: Data });
            }

            if (responseObject.data != null) {
                const Data = { target: "filterOwnerTasks", data: response.responseText };
                ipcRenderer.send("tsUtil", { source: "allTasks", target: "task", data: Data });
                // need to run the API call again and offset the results by 9000 to get the next set of tasks
                if (offset === undefined || offset === null) {
                    offset = "0";
                }
                if (Number(totalNumberOfTasks) > (Number(offset) + responseObject.data.length)) {
                    offset = String(Number(offset) + 9000);
                    ApiUtil.getAllTasks(null, userId, offset, newList);
                } else {
                    // all tasks have been loaded so signal that here
                    ipcRenderer.send("balloon",
                        { title: "Tasks", contents: totalNumberOfTasks + " Retrieved\nGetting details" });
                    // use ts to filter task list to increase speed
                    // ApiUtil.filterTasks(newList, userId);
                }
            }
        }
    }

    public static filterTasks(tasks: [], userId: string) {
        ApiUtil.Log("filterTasks");
        const taskList = new Array();
        for (const task of tasks) {
            if (task.owner !== null && task.owner !== undefined) {
                const owner = task.owner;
                const ownerId = owner.id;
                if ((ownerId === userId) &&
                    !taskList.includes(task.id) && (task.phase.id !== "phase.task.completed")) {
                    taskList.push(task.id);
                }
            }
        }
        // send task list to the corect component
        const data = { source: "allTasks", data: taskList };
        ipcRenderer.send("internal", data);
    }

    public static getTaskDetails(response: any, taskId: string) {
        ApiUtil.Log("getTaskDetails");
        const url = urlStart + "1002/tasks/" + taskId;
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getTaskDetails, taskId);
        } else {
            // pull out task details in this api then pass the details to util for storage. To save on rendering time
            const taskToAdd = JSON.parse(response.responseText);
            // "userTaskDetails" <- this is the thing that the tasks component is listening for to make a task component
            const data = { source: "userTaskDetails", data: taskToAdd };
            ipcRenderer.send("internal", data);
            // send details to util for storage
            const Data = { target: "taskDetails", data: taskToAdd };
            ipcRenderer.send("tsUtil", { target: "task", data: Data });
        }
    }

    public static getStoryDetails(response: any, storyId: string, listener: any) {
        ApiUtil.Log("getStoryDetails");
        const url = urlStart + "1002/work_items/" + storyId;
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getStoryDetails, storyId, listener);
        } else {
            // pull out task details in this api then pass the details to util for storage. To save on rendering time
            const StoryDetails = JSON.parse(response.responseText);

            const data = { source: listener, data: StoryDetails };
            ipcRenderer.send("internal", data);
            // send details to util for storage
            // const Data = { target: "taskDetails", data: taskToAdd };
            // ipcRenderer.send("tsUtil", { target: "task", data: Data });
        }
    }

    public static getStoryAttachments(response: any, storyId: string, listener: string) {
        ApiUtil.Log("getStoryAttachmetns");
        const url = urlStart + "1002/work_items/" + storyId + "?fields=attachments";
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getStoryAttachments, storyId, listener);
        } else {
            const AttachDetails = JSON.parse(response.responseText);
            const data = { source: listener, data: AttachDetails.attachments.data };
            ipcRenderer.send("internal", data);
        }
    }

    public static getAttachmentDetails(response: any, attachmentId: string, listener: string) {
        ApiUtil.Log("getAttachmentDetails");
        const url = urlStart + "1002/attachments/" + attachmentId;
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getAttachmentDetails, attachmentId, listener);
        } else {
            const AttachDetails = JSON.parse(response.responseText);
            const data = { source: listener, data: AttachDetails };
            ipcRenderer.send("internal", data);
        }
    }

    public static getComments(response: any, storyId: string, listener: string) {
        ApiUtil.Log("getComments");
        const url = urlStart + "1002/work_items/" + storyId + "?fields=comments";
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getComments, storyId, listener);
        } else {
            const commentObject = JSON.parse(response.responseText).comments.data;
            if (commentObject.length > 0) {
                for (const c of commentObject) {
                    ApiUtil.getSingleComment(null, c.id, listener);
                }
            }
        }
    }

    public static getSingleComment(response: any, commentId: string, listener: string) {
        ApiUtil.Log("getSingleComment");
        const url = urlStart + "1002/comments/" + commentId;
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getSingleComment, commentId, listener);
        } else {
            const commentObject = JSON.parse(response.responseText);
            const data = { source: listener, data: commentObject };
            ipcRenderer.send("internal", data);
        }
    }


    // -----------------------------get octane details ------------------------------

    // -----------------------------put things into octane ------------------------------
    public static updateTask(update: any) {
        const task = update.taskId;
        const url = urlStart + "1002/tasks/" + task;
        const after = update.after;
        ApiUtil.Put(url, update.data, after);
    }

    public static PostComment(response: any, commentText: string, userId: string, workspaceItemId: string) {
        if (response === null || response === undefined) {
            const toPost = {
                data: [
                    {
                        author: {
                            id: userId,
                            type: "workspace_user",
                        },
                        owner_work_item: {
                            id: workspaceItemId,
                            type: "work_item",
                        },
                        text: commentText,
                    },
                ],
            };
            const json = JSON.stringify(toPost);
            const url = urlStart + "1002/comments";
            ApiUtil.Push(url, json, ApiUtil.PostComment, commentText, userId, workspaceItemId);
        } else {
            // signal posting status
            const arg = {
                data: { status: response.status, all: response },
                source: workspaceItemId + "postComment",
            };
            ipcRenderer.send("internal", arg);
        }
    }
    // -----------------------------put things into octane ------------------------------

    // -----------------------------Remove things into octane ------------------------------
    public static DeleteComment(response: any, targetCommentId: string) {
        if (response === null || response === undefined) {
            // send delete request here
            const url = urlStart + "1002/comments/" + targetCommentId;
            ApiUtil.Delete(url, this.DeleteComment, targetCommentId);
        } else {
            // send confirmation of delete here
        }
    }

    // -----------------------------Remove things into octane ------------------------------

    // -----------------------------put things into store ------------------------------
    public static updateUsername(username: string) {
        this.updateToBack({ target: "update", property: "Username", value: username });
    }

    public static updateToBack(update: any) {
        ipcRenderer.send("tsUtil", { target: "details", data: update });
    }
    // -----------------------------put things into store ------------------------------


    // -----------------------------get things from store ------------------------------
    public static retrieve(property: string, RequestSource: string) {
        ipcRenderer.on("retrieveFromStore", this.returnToSender);
        ipcRenderer.send("tsUtil", { source: "retrieveFromStore", target: "retrieve", data: { target: property } });
    }

    private static returnToSender = (event: any, value: any) => {
        const whatCameBack = value;
    }
    // -----------------------------get things from store ------------------------------

    // -----------------------------Logging---------------------------------------------

    private static Log(log: string) {
        ipcRenderer.send("logging", { Log: log });
    }
    // -----------------------------Logging---------------------------------------------


    // -----------------------------HTTP methods------------------------------

    private static Get(url: string, after: any, extra?: any, extra2?: any, extra3?: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra, extra2, extra3);
            } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
                after(xmlHttp, extra, extra2);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("accept", "application/json");
        xmlHttp.send(null);
    }

    private static Put(url: string, data: any, after?: any, extra?: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra);
            }
        };
        xmlHttp.open("PUT", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(data);
    }

    private static Push(url: string, data: string, after?: any, extra?: any, extra2?: any, extra3?: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra, extra2, extra3);
            } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
                after(xmlHttp, extra, extra2, extra3);
            }
        };
        xmlHttp.open("POST", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(data);
    }

    private static Delete(url: string, after?: any, extra?: any, extra2?: any, extra3?: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra, extra2, extra3);
            } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
                after(xmlHttp, extra, extra2, extra3);
            }
        };
        xmlHttp.open("DELETE", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send();
    }
}
