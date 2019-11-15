import { DesktopCapturerSource } from "electron";
import * as React from "react";

export class VideoPane extends React.Component<{
    src?: any,
    captureSrc?: DesktopCapturerSource,
    setVideoStream?: any,
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

    public componentWillUnmount() {
        const vid = document.getElementById(this.props.id) as HTMLVideoElement;
        if (vid !== null) {
            vid.pause();
        }
    }

    public componentWillReceiveProps(props: any) {
        const vid = document.getElementById(this.props.id);
        this.initialiseStream(vid, props.captureSrc.id);
    }

    public render() {
        return this.createElement();
    }

    private createElement = () => {
        return <video id={this.props.id} controls />;
    }

    private initialiseStream = (videoElement: any, capId?: string) => {
        let screen = this.props.captureSrc.id;
        if (capId !== undefined) {
            screen = capId;
        }
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    // deviceId: src.id,
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: screen,
                    },
                },
            }).then((stream: MediaStream) => {
                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.play();
                    this.props.setVideoStream(stream);
                }
            });
        return true;
    }
}
