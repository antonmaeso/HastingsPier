import * as React from "react";

export class Option {
    public Value: string;
    public Text: string;
    public Other: any;

    constructor(value: string, text?: string, other?: any) {
        this.Text = text;
        this.Value = value;
        this.Other = other;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class DropDown extends React.Component<{
    Options: Option[];
}, {}> {

    public render() {
        return <select>{this.buildOptions()}</select>;
    }

    private buildOptions = () => {
        const options = new Array();
        this.props.Options.forEach((opt) => {
            const toadd = <option value={opt.Value}>{opt.Text ? opt.Text : opt.Value}</option>;
            options.push(toadd);
        });
        return options;
    }
}
