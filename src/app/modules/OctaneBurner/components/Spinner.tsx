import { ipcRenderer } from "electron";
import * as React from "React";
import styled, { keyframes } from "styled-components";
import octIcon from "./../assets/octaneIcon.png";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  animation: ${rotate} 3s linear infinite;
  width: 50%;
  max-width: 400px;
  `;

export const Spinner = (props: any) => {
  return <React.Fragment>
    <div className="OctSpinner">
      <Rotate>
        <img width="100%" src={octIcon} alt="Loading" />
      </Rotate>
      <div>{props.LoadingMessage}</div>
    </div>
  </React.Fragment>;
}
