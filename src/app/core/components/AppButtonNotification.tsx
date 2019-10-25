import * as React from "react";
import { NotifyObject } from "./ApplicationButton";

export const ButtonNotification = (props: any) => {
    // array of notifications to show passed in as an array or map.
    // Hover shows this under the location of the hover
    // display a scrolling list of the unread notifications.
    // include a button to show old notifications?
    const setRead = props.setRead;
    const notifications = props.notifications;
    const toShow: JSX.Element[] = [];
    notifications.forEach((notification: NotifyObject) => {
        toShow.push(notificationLine(notification.notification));
    });

    return <div className="notifyList">{toShow}</div>;
};

const notificationLine = (toShow: string) => {
    return <div className="notifyline">{toShow}</div>;
};
