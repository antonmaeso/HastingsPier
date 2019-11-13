import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";
import * as React from "react";
import { VideoPane } from "./components/VideoPane";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";

export class VideoRecording extends React.Component<{}, {}> {
    public render() {
        return <React.Fragment>
            <VideoPane id="videoElement" />
        </React.Fragment>;
    }
}
