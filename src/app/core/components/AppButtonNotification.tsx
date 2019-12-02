import * as React from "react";
import { NotifyObject } from "./ApplicationButton";

interface IProps {
    notifications: NotifyObject[];
    appName: string;
}

export const ButtonNotification = (props: IProps) => {
    // array of notifications to show passed in as an array or map.
    // Hover shows this under the location of the hover
    // display a scrolling list of the unread notifications.
    // include a button to show old notifications?
    const notifications = props.notifications;
    const toShow: JSX.Element[] = [];
    notifications.forEach((notification: NotifyObject) => {
        toShow.push(notificationLine(notification.notification));
    });

    React.useEffect(() => {
        // When new notifications, reload notification lines
     }, props.notifications);

    return <div id={"divnotify" + props.appName} className="notifyList">{toShow}</div>;
};

const notificationLine = (toShow: string) => {
    return <div key={toShow} className="notifyLine">{toShow}</div>;
};

// make the notification apear at the mouse
