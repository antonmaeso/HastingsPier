import * as React from "react";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";

export const VideoRecording = (props: any) => {
    return <video id="videoElement" controls />;
};

const initialiseListeners = () => {
    
}
