import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { OctaneLogin } from "./components/OctaneLoading";
import { Spinner } from "./components/Spinner";
import "./style/octaneStyle.scss";

export const OctaneParent = (props: any) => {
  const [UserId, setUserId] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);

  return (
    <React.Fragment>
      {loggedIn ? <div>Logged in. {UserId}</div> : <React.Fragment>
        {loggingIn ? <Spinner /> : null}
        <OctaneLogin
          LoggedIn={(pending: boolean, LIN: boolean) => { setLoggingIn(pending); setLoggedIn(LIN); }}
          LoggingIn={(id: string) => { setUserId(id); }}
        />
      </React.Fragment>}
    </React.Fragment>
  );
};
