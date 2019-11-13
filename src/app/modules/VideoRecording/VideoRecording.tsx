import * as React from "react";
import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";

export class VideoRecording extends React.Component<{}, {}>{
    public render() {
        return <video id="videoElement" controls style={{ maxWidth: "100%" }} />;
    }
}
