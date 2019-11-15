import { DesktopCapturerSource } from "electron";
import * as React from "react";

export class VideoPane extends React.Component<{
    src?: any,
    captureSrc?: DesktopCapturerSource,
    id: string,
}, {
    VideoElement: HTMLVideoElement,
    StreamInitialised: boolean,
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            StreamInitialised: false,
            VideoElement: null,
        };
    }

    public componentDidMount() {
        const vid = document.getElementById(this.props.id);
        let init = this.state.StreamInitialised;
        if (this.props.captureSrc !== undefined && vid !== null && !init) {
            init = this.initialiseStream(vid);
        }
        if (vid !== null && vid !== undefined) {
            this.setState({ StreamInitialised: init });
        }
    }

    public render() {
        return this.createElement();
    }

    private createElement = () => {
        return <video id={this.props.id} controls />;
    }

    private initialiseStream = (videoElement: any) => {
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    // deviceId: src.id,
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: this.props.captureSrc.id,
                    },
                },
            }).then((stream: MediaStream) => {
                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.play();
                }
            });
        return true;
    }
}
