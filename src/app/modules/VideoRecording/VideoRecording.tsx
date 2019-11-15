import { desktopCapturer, DesktopCapturerSource } from "electron";
import * as React from "react";
import { Button } from "../../core/components/library/Button";
import { DropDown } from "../../core/components/library/DropDown";
import { Option } from "../../core/components/library/DropDown";
import { VideoControls } from "./components/VideoControls";
import { VideoPane } from "./components/VideoPane";
import "./style/VideoRecord.scss";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";

export class VideoRecording extends React.Component<{}, {
    CaptureOptions: Map<string, Option>,
    ChosenOption: string,
    ErrorMessage: string,
    VideoStream: MediaStream,
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            CaptureOptions: new Map<string, Option>(),
            ChosenOption: null,
            ErrorMessage: null,
            VideoStream: null,
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
                <VideoPane id="videoElement"
                    captureSrc={this.state.CaptureOptions.get(this.state.ChosenOption).Other}
                    // setVideoStream={this.setVideoStream} 
                    />
                : null}
        </React.Fragment>;
    }

    private setVideoStream = (stream: MediaStream) => {
        this.setState({ VideoStream: stream });
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
