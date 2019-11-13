import * as React from "react";
import { clipboard } from "electron";

// export const Button = (props: any) => {
//   let button = null;
//   if (props.type === "glyphiconButton") {
//     button = glyphiconButton(props);
//   } else {
//     button = StandardButton(props);
//   }
//   return button;
// };


export class Button extends React.Component<{
  alt?: string,
  type?: string,
  className?: string,
  HoverText?: string,
  MouseDown?: any,
  MouseUp?: any,
  onDblclick?: any,
  onRightClick?: any,
  onClick: any,
  Style?: any,
  Text: string,
}, {}> {
  public render() {
    switch (this.props.type) {
      case "glyphiconButton": {
        return this.glyphiconButton();
      }
      case "imgButton": {
        return this.ImgButton();
      }
      default: {
        return this.StandardButton();
      }
    }
  }

  private ImgButton() {
    return (
      <div className={this.props.className} />
    );
  }

  private glyphiconButton() {
    return (
      <div
        className={"glyphiconButton glyphicon glyphicon-" + this.props.Text}
        onClick={this.props.onClick}
        title={this.props.HoverText}
      />
    );
  }

  private StandardButton() {
    return (
      <button
        className={this.props.className}
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDblclick}
        onMouseUp={this.props.MouseUp}
        onMouseDown={this.props.MouseDown}
        title={this.props.HoverText}
        onContextMenu={this.rightClick}>
      </button>
    );
  }

  private rightClick = () => {
    if (this.props.onRightClick !== undefined && this.props.onRightClick !== null) {
      this.props.onRightClick();
    } else {
      clipboard.writeText(this.props.Text);
      // this.balloon("Notice", "Text Copied to clipborad");
    }
  }
}

