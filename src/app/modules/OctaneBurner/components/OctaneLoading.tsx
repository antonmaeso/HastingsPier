import { ipcRenderer, remote } from "electron";
import * as React from "React";
import { Button } from "../../../core/components/library/Button";
import { TextInput } from "../../../core/components/library/TextInput";
import * as N from "../../../core/util/Notify";
import * as Ps from "../../../core/util/PersistantStorage";
import { ApiUtil } from "../Util/ApiUtil";

const errorStyle = {
    color: "red",
    fontSize: "18px",
};

export class OctaneLogin extends React.Component<
    { className?: string, LoggingIn: any, LoggedIn: any },
    { userName: string, password: string, failedLogin: boolean, failedReason: any }> {

    constructor(props: any) {
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state = {
            failedLogin: false,
            failedReason: null,
            password: "",
            userName: "",
        };
    }

    public username = (name: string) => {
        this.setState({ userName: name });
    }

    public pass = (pw: string) => {
        this.setState({ password: pw });
    }

    public openWindow() {
        N.Balloon("Login", "Logging in");
        this.setState({ failedLogin: false });
        this.props.LoggingIn(true, false);
        const mainWindow = remote.BrowserWindow.getFocusedWindow();
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
        const loginWindow = remote.BrowserWindow.getFocusedWindow();
        loginWindow.hide();
        mainWindow.focus();
        let usernameJs = "document.getElementById('federateLoginName')";
        usernameJs += ".value='" + this.state.userName + "';";
        usernameJs += "document.getElementById('fed-submit').click();";
        let passJs = "document.getElementById('password')";
        passJs += ".value = '" + this.state.password + "';";
        let passclick = "document.getElementById('submit_button').click();";
        passclick += "";

        loginWindow.webContents.on("did-finish-load", () => {
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(usernameJs);
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(passJs);
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(passclick);
            this.wait(3000);
            loginWindow.close();
            ApiUtil.getWorkspaceId(null);
        });
        mainWindow.focus();
    }

    public componentDidMount(): void {
        // load up any saved log in details
        const fromStore = Ps.getLocal("OctaneBurnerUserName");
        if (fromStore !== null) {
            this.setState({ userName: fromStore });
        }

        // TODO: all of this needs replacing and replicating

        ipcRenderer.on("usernameRetrieve", this.onRetrieve);
        ipcRenderer.on("workspaceSuccess", this.logInSuccess);
        ipcRenderer.on("workspaceFail", this.loginFail);
        ipcRenderer.send("tsUtil",
            {
                source: "usernameRetrieve", target: "details", data:
                    { target: "retrieve", data: { target: "USERNAME" } },
            });
    }

    public componentWillUnmount(): void {
        this.setState({ password: "" });
        ipcRenderer.removeAllListeners("usernameRetrieve");
        ipcRenderer.removeAllListeners("workspaceSuccess");
        ipcRenderer.removeAllListeners("workspaceFail");
    }

    public logInSuccess = (event: any, value: any) => {
        // this sets the state to logged in, put into check success action
        // value should be the workspaceID for the user.
        N.Balloon("Success", "Logged in");
        // save username to local storage
        Ps.putLocal("OctaneBurnerUserName", this.state.userName);
        ApiUtil.updateUsername(this.state.userName);
        this.props.LoggingIn(false, true);
    }

    public loginFail = (event: any, value: any) => {
        this.setState({ failedLogin: true });
        N.Balloon("Error", "Could not log in");
        this.props.LoggingIn(false, false);
    }

    public render() {
        const ph = "Email@hastingsdirect.com";
        const pw = "password";

        return <div className={"OctaneLoginContainer " + this.props.className}>
            This tool loads stories from Octane based on Tasks with you as the Owner.
            If there are no tasks with you as the Owner, nothing will be displayed
            <TextInput className="LoginBoxes" Placeholder={ph} Change={this.username} Text={this.state.userName} />
            <TextInput className="LoginBoxes" Placeholder={pw} Type={pw} Change={this.pass} OnEnter={this.openWindow} />
            {this.state.failedLogin ?
                <div style={errorStyle}>Login Failed, Please check username and password</div> :
                null}
            {this.state.password !== "" && this.state.userName !== "" ?
                <Button
                    key={"octaneLogin"}
                    onClick={this.openWindow}
                    Text="Log in" /> : null}
        </div >;
    }

    private onRetrieve = (event: any, value: string) => {
        this.setState({ userName: value });
    }
    private wait(ms: number) {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    }
}
