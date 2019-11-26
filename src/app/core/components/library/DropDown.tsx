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
    Options: Option[],
    disabled?: boolean,
    onChange: any,
    className?: string,
}, {
    Value: string,
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            Value: "",
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        let toReturn;
        if (this.props.disabled) {
            toReturn = <select disabled className={this.props.className}
                value={this.state.Value}
                onChange={this.handleChange}>{this.buildOptions()}</select>;
        } else {
            toReturn = <select className={this.props.className}
                value={this.state.Value}
                onChange={this.handleChange}>{this.buildOptions()}</select>;
        }
        return toReturn;
    }

    private handleChange = (event: any) => {
        this.props.onChange(event);
        this.setState({ Value: event.target.value });
    }

    private buildOptions = () => {
        const options = new Array();
        // options.push(<option>Please chose an option</option>);
        this.props.Options.forEach((opt) => {
            const toadd = <option key={opt.Value} value={opt.Value}>{opt.Text ? opt.Text : opt.Value}</option>;
            options.push(toadd);
        });
        return options;
    }
}
