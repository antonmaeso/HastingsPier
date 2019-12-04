import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { Button } from "../../../core/components/library/Button";
import { TextInput } from "../../../core/components/library/TextInput";
import * as N from "../../../core/util/Notify";
import * as Ps from "../../../core/util/PersistantStorage";
import { ApiUtil } from "../util/ApiUtil";

const errorStyle = {
    color: "red",
    fontSize: "18px",
};

interface IProps {
    className?: string;
    LoggingIn: any;
    LoggedIn: any;
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

    // { userName: string, password: string, failedLogin: boolean, failedReason: any }> {

    // constructor(props: any) {
    //     super(props);
    //     this.openWindow = this.openWindow.bind(this);
    //     this.state = {
    //         failedLogin: false,
    //         failedReason: null,
    //         password: "",
    //         userName: "",
    //     };
    // }

    // public username = (name: string) => {
    //     this.setState({ userName: name });
    // }

    // public pass = (pw: string) => {
    //     this.setState({ password: pw });
    // }

    const openWindow = () => {
        N.Balloon("Login", "Logging in");
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

            ApiUtil.getWorkspaceId(null);
        });
        mainWindow.focus();
    };

    //  componentDidMount(): void {
    //     // load up any saved log in details
    //     const fromStore = Ps.getLocal("OctaneBurnerUserName");
    //     if (fromStore !== null) {
    //         this.setState({ userName: fromStore });
    //     }

    //     // TODO: all of this needs replacing and replicating

    //     ipcRenderer.on("usernameRetrieve", this.onRetrieve);
    //     ipcRenderer.on("workspaceSuccess", this.logInSuccess);
    //     ipcRenderer.on("workspaceFail", this.loginFail);
    //     ipcRenderer.send("tsUtil",
    //         {
    //             source: "usernameRetrieve", target: "details", data:
    //                 { target: "retrieve", data: { target: "USERNAME" } },
    //         });
    // }

    // public componentWillUnmount(): void {
    //     this.setState({ password: "" });
    //     ipcRenderer.removeAllListeners("usernameRetrieve");
    //     ipcRenderer.removeAllListeners("workspaceSuccess");
    //     ipcRenderer.removeAllListeners("workspaceFail");
    // }

    // const logInSuccess = (event: any, value: any) => {
    //     // this sets the state to logged in, put into check success action
    //     // value should be the workspaceID for the user.
    //     N.Balloon("Success", "Logged in");
    //     // save username to local storage
    //     Ps.putLocal("OctaneBurnerUserName", userName);
    //     ApiUtil.updateUsername(userName);
    //     props.LoggingIn(false, true);
    // };

    // const loginFail = (event: any, value: any) => {
    //     setFailedLogin(true);
    //     N.Balloon("Error", "Could not log in");
    //     props.LoggingIn(false, false);
    // };

    const onRetrieve = (event: any, value: string) => {
        setUserName(value);
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
