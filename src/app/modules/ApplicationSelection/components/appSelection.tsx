import * as React from "react";
import "../style/applicationSelection.scss";
import "../style/appIcon.scss"
import { Button } from "../../../core/components/library/Button";
import { ipcRenderer } from "electron";

export const AppSelection = (props: any) => {

  return (
    <div className="applicationWindow AppSelection">
      Application Selection      
    </div>
  );
};

