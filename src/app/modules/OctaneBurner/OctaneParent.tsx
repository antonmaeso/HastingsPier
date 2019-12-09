import * as React from "react";
import { OctaneLogin } from "./components/OctaneLoading";
import { Spinner } from "./components/Spinner";
import "./style/octaneStyle.scss";

export const BaseUrl = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/";

export const OctaneParent = (props: any) => {
  const [UserId, setUserId] = React.useState("");
  const [UserName, setUsername] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [workspaceId, setWorkspaceId] = React.useState("");
  const [allUsers, setAllUsers] = React.useState(new Map<string, any>());

  let hide = "";
  if (loggingIn) {
    hide = "hidden";
  }

  return (
    <React.Fragment>
      {loggedIn ? <div>Logged in. {UserId}</div> : <React.Fragment>
        {loggingIn ? <Spinner /> : null}
        <OctaneLogin
          className={hide}
          LoggingIn={(pending: boolean, LIN: boolean) => {
            setLoggingIn(pending);
            setLoggedIn(LIN);
          }}
          LoggedIn={(id: string, name: string, allusers: Map<string, any>, workspace: string) => {
            setUserId(id);
            setUsername(name);
            setAllUsers(allusers);
            setWorkspaceId(workspace);
          }}
        />
      </React.Fragment>}
    </React.Fragment>
  );
};
