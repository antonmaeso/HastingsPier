import * as React from "react";
import { NotifyObject } from "./ApplicationButton";

interface IProps {
    notifications: NotifyObject[];
    appName: string;
    show: boolean;
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

    const [leftmargin, setLeftMargin] = React.useState(-1000);
    // move the box so that it is in the correct position

    const leftMargin = (show: boolean) => {
        // get notification window width

        if (show) {
            const margin = document.getElementById("divnotify" + props.appName).getBoundingClientRect().width;
            setLeftMargin(margin);
        } else {
            setLeftMargin(-10000);
        }
    };

    React.useEffect(() => {
        // When new notifications, reload notification lines
        try {
            leftMargin(props.show);
        } catch{ }
    });


    return <div
        style={{ marginLeft: leftmargin }}
        id={"divnotify" + props.appName}
        className="notifyList"
        onMouseEnter={() => { leftMargin(true); }}
        onMouseLeave={() => { leftMargin(false); }}
    >{toShow}</div>;
};

const notificationLine = (toShow: string) => {
    return <div key={toShow} className="notifyLine">{toShow}</div>;
};

