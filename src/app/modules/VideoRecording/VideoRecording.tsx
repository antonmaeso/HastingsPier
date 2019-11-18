import {desktopCapturer, DesktopCapturerSource } from "electron";
import * as React from "react";
import { Button } from "../../core/components/library/Button";
import { DropDown } from "../../core/components/library/DropDown";
import { Option } from "../../core/components/library/DropDown";
import { VideoControls } from "./components/VideoControls";
import { VideoPane } from "./components/VideoPane";
import "./style/VideoRecord.scss";

const fs = require("fs");

const { app, dialog } = require("electron").remote;

let mediaRecorder: MediaRecorder = null;
let SuperBlob: Blob = null;
let VideoStream: MediaStream = null;
const codec = " codecs=vp9";
const recordedChunks: any[] = [];
const video = "video/webm";
const videoId = "videoElement";
export class VideoRecording extends React.Component<{}, {
    CaptureOptions: Map<string, Option>,
    ChosenOption: string,
    ErrorMessage: string,
    Source: any,
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            CaptureOptions: new Map<string, Option>(),
            ChosenOption: null,
            ErrorMessage: null,
            Source: null,
        };
    }
    public render() {
        // On initial load of parent component add record options to app menu bar
        // A drop down with all the availible options for capture - Done
        // Select an option and it starts the preview
        // Press record to start recording
        // Dissable stream selection while recording
        // Change menu bar icon, maybe app tray icon too, to a recording in progress icon
        // Press stop to stop recording, change icon back
        // Present option to save file
        // Click save, present save file dialog
        // If they press record again, warn about overwriting existing option.
        // On app remove from Dom, remove recording icons from menu
        this.state.CaptureOptions.size === 0 ? this.getCaptureOptions() : null;
        return <React.Fragment>
            <div>{this.state.ErrorMessage}</div>
            {this.state.CaptureOptions.size === 0 ? null :
                <React.Fragment>
                    <div style={{ width: "100%", display: "flex" }}>
                        <DropDown className="sources"
                            Options={Array.from(this.state.CaptureOptions.values())}
                            onChange={this.sourceSelected} />
                        <Button className="sources" Text="Refresh" onClick={() => this.getCaptureOptions()} />
                    </div>
                </React.Fragment>
            }
            {this.state.ChosenOption ?
                <React.Fragment>
                    <VideoPane
                        id={videoId}
                        captureSrc={this.state.CaptureOptions.get(this.state.ChosenOption).Other}
                        setVideoStream={this.setVideoStream}
                        src={this.state.Source}
                    />
                    <VideoControls
                        recordFunction={this.startRecording}
                        stopRecord={this.stopRecording}
                        liveView={this.switchToLive}
                        save={this.saveLocation}
                        />
                </React.Fragment>
                : null}
        </React.Fragment>;
    }

    private saveLocation = () => {
        const localPath = app.getPath("desktop");
        const filter = [{ name: "webm video", extensions: ["webm"] }];
        const savePath = dialog.showSaveDialogSync({ defaultPath: localPath, filters: filter });
        if (savePath) {
            this.bigSave(savePath);
        }
    }

    private bigSave = (file: string) => {
        const blob = new Blob(recordedChunks, { type: video });
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const ab = this.result;
            const buffer = new Buffer(ab.byteLength);
            const arr = new Uint8Array(ab);
            for (let i = 0; i < arr.byteLength; i++) {
                buffer[i] = arr[i];
            }
            // const file = `./videos/example.webm`;
            fs.writeFile(file, buffer, (err) => {
                if (err) {
                    console.error("Failed to save video " + err);
                    // ipcRenderer.send("balloon", { title: "Video", contents: "Failed to save video" });
                    // ipcRenderer.send("logging", { Log: "Failed to save video: " + err });
                } else {
                    console.log("Saved video: " + file);
                    // ipcRenderer.send("balloon", { title: "Video", contents: "Saved video: " + file });
                    // ipcRenderer.send("logging", { Log: "Saved video: " + file });
                }
            });
        };
        fileReader.readAsArrayBuffer(blob);
    }

    private playBackRecording = () => {
        SuperBlob = new Blob(recordedChunks, { type: video });
        this.setState({ Source: window.URL.createObjectURL(SuperBlob) });
    }

    private switchToLive = () => {
        this.setState({ Source: null });
    }

    private stopRecording = () => {
        mediaRecorder.onstop = () => { this.playBackRecording(); };
        mediaRecorder.stop();
    }

    private startRecording = () => {
        const options = { mimeType: video + ";" + codec, videoBitsPerSecond: 500000 };
        recordedChunks.length = 0;
        if (VideoStream !== undefined && VideoStream !== null) {
            mediaRecorder = new MediaRecorder(VideoStream, options);
            mediaRecorder.ondataavailable = this.handleDataAvailable;
            mediaRecorder.start();
        }
    }

    private handleDataAvailable(event: any) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    private setVideoStream = (stream: MediaStream) => {
        VideoStream = stream;
    }

    private sourceSelected = (event: any) => {
        const chosen = event.target.value;
        this.setState({ ChosenOption: chosen });
    }

    private getCaptureOptions() {
        const opt = new Map<string, Option>();
        desktopCapturer.getSources({
            thumbnailSize: {
                height: 256,
                width: 256,
            },
            types: ["screen", "window"],
        }, (error: Error, srcs: DesktopCapturerSource[]) => {
            if (error) {
                this.setState({ ErrorMessage: error.message });
                console.log(error);
                throw error;
            }
            for (const src of srcs) {
                opt.set(src.id, new Option(src.id, src.name, src));
            }
            this.setState({ CaptureOptions: opt });
        });
    }
}
