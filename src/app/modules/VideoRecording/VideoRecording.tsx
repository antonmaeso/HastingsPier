import { desktopCapturer, DesktopCapturerSource } from "electron";
import * as React from "react";
import { VideoPane } from "./components/VideoPane";
import { VideoControls } from "./components/VideoControls";
import { Button } from "../../core/components/library/Button";
import { DropDown } from "../../core/components/library/DropDown";
import { Option } from "../../core/components/library/DropDown";
import "./style/VideoRecord.scss";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";

export class VideoRecording extends React.Component<{}, { CaptureOptions: Option[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            CaptureOptions: new Array<Option>(),
        };
    }
    public render() {
        // On initial load of parent component add record options to app menu bar
        // A drop down with all the availible options for capture
        // Select an option and it starts the preview
        // Press record to start recording
        // Change menu bar icon, maybe app tray icon too, to a recording in progress icon
        // Press stop to stop recording, change icon back
        // Present option to save file
        // Click save, present save file dialog
        // If they press record again, warn about overwriting existing option.
        // On app remove from Dom, remove recording icons from menu
        this.getCaptureOptions();
        return <React.Fragment>
            <DropDown Options={this.state.CaptureOptions} />
            <VideoPane id="videoElement" />
            <Button Text="Preview Video" onClick={null} />
        </React.Fragment>;
    }

    private getCaptureOptions() {
        const options = new Array<Option>();
        desktopCapturer.getSources({
            thumbnailSize: {
                height: 256,
                width: 256,
            },
            types: ["screen", "window"],
        }, (error: Error, srcs: DesktopCapturerSource[]) => {
            if (error) {
                console.log(error);
                throw error;
            }
            for (const src of srcs) {
                options.push(new Option(src.name));
            }
            this.setState({ CaptureOptions: options });
        });
    }
}
