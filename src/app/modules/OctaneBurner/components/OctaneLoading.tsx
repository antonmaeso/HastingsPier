import { remote } from "electron";
import * as React from "react";
import { Button } from "../../../core/components/library/Button";
import { TextInput } from "../../../core/components/library/TextInput";
import { Get } from "../../../core/util/classes/HttpRequest";
import * as N from "../../../core/util/Notify";
import * as Ps from "../../../core/util/PersistantStorage";
import { notification } from "../components/Spinner";
import { BaseUrl } from "../OctaneParent";

const errorStyle = {
    color: "red",
    fontSize: "18px",
};

let WorkspaceId: string;

interface IProps {
    className?: string;
    LoggingIn: (pending: boolean, LIN: boolean) => void;
    LoggedIn: (id: string, name: string, allUsers: Map<string, any>, workspace: string) => void;
}

export const OctaneLogin = (props: IProps) => {
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [failedLogin, setFailedLogin] = React.useState(false);
    const [failedReason, setFailedReason] = React.useState("");

    // load from store
    if (userName === "") {
        const fromStore = Ps.getLocal("OctaneBurnerUserName");
        if (fromStore !== null) {
            setUserName(fromStore);
        }
    }

    const openWindow = () => {
        N.Balloon("Login", "Logging in");
        notification("Logging in");
        setFailedLogin(false);
        props.LoggingIn(true, false);
        const mainWindow = remote.BrowserWindow.getFocusedWindow();
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
        const loginWindow = remote.BrowserWindow.getFocusedWindow();
        loginWindow.hide();
        mainWindow.focus();
        let usernameJs = "document.getElementById('federateLoginName')";
        usernameJs += ".value='" + userName + "';";
        usernameJs += "document.getElementById('fed-submit').click();";
        let passJs = "document.getElementById('password')";
        passJs += ".value = '" + password + "';";
        let passclick = "document.getElementById('submit_button').click();";
        passclick += "";

        loginWindow.webContents.on("did-finish-load", () => {
            wait(1000);
            loginWindow.webContents.executeJavaScript(usernameJs);
            wait(1000);
            loginWindow.webContents.executeJavaScript(passJs);
            wait(1000);
            loginWindow.webContents.executeJavaScript(passclick);
            wait(3000);
            loginWindow.close();

            Ps.putLocal("OctaneBurnerUserName", userName);

            getWorkspaceId();
        });
        mainWindow.focus();
    };

    const getWorkspaceId = (response?: any) => {
        if (response === undefined || response === null) {
            Get(BaseUrl, getWorkspaceId);
        } else {
            // check status
            if (response.status !== 200) {
                // login has failed, try again
                setFailedLogin(true);
                props.LoggingIn(false, false);
            } else {
                // pull out id
                WorkspaceId = JSON.parse(response.responseText).data[0].id;
                props.LoggingIn(false, true);
                notification("Logged in");
                getUserId();
            }
        }
    };

    const getUserId = (response?: any) => {
        const url = BaseUrl + WorkspaceId + "/workspace_users?fields=email,first_name,id,last_name";
        if (response === undefined || response === null) {
            Get(url, getUserId);
        } else {
            // pass response to util to pull out the desired ID
            const data = response.responseText;
            pullOutUserId(userName, data);
        }
    };

    const pullOutUserId = (targetEmail: string, OctaneRespone: any) => {
        const userList = new Map<string, object>();
        let toReturn = "";
        // Pull apart the json message from octane into objects.
        const UserInfo = JSON.parse(OctaneRespone);
        const users = UserInfo.data;
        // look though each one for the user who logged in.
        // while here create in memory list of users. Dictionary with id as key. user object as value
        // tslint:disable-next-line: forin
        for (const person of users) {
            const email = person.email;
            const ID = person.id;
            if (email !== undefined) {
                if (email.toUpperCase() === targetEmail.toUpperCase()) {
                    toReturn = ID;
                }
                userList.set(ID, person);
            }
        }
        props.LoggedIn(toReturn, targetEmail, userList, WorkspaceId);
    };

    const wait = (ms: number) => {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    };

    const ph = "Email@hastingsdirect.com";
    const pw = "password";

    return (<div className={"OctaneLoginContainer " + props.className}>
        This tool loads stories from Octane based on Tasks with you as the Owner.
        If there are no tasks with you as the Owner, nothing will be displayed
            <TextInput className="LoginBoxes" Placeholder={ph} Change={setUserName} Text={userName} />
        <TextInput className="LoginBoxes" Placeholder={pw} Type={pw} Change={setPassword} OnEnter={openWindow} />
        {failedLogin ?
            <div style={errorStyle}>Login Failed, Please check username and password</div> :
            null}
        {password !== "" && userName !== "" ?
            <Button
                key={"octaneLogin"}
                onClick={openWindow}
                Text="Log in" /> : null}
    </div >);
};
