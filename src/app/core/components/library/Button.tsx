import { clipboard } from "electron";
import * as React from "react";
import { ErrorBoundary } from "../ErrorBoundry";

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
      case "cssImgButton": {
        return this.CssImgButton();
      }
      default: {
        return this.StandardButton();
      }
    }
  }

  private CssImgButton() {
    // used when you want to set the image in a button though a CSS class
    return (<ErrorBoundary>
      <div
        className={this.props.className}
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDblclick}
        title={this.props.Text} />
    </ErrorBoundary>
    );
  }

  private glyphiconButton() {
    return (<ErrorBoundary>
      <div
        className={"glyphiconButton glyphicon glyphicon-" + this.props.className}
        onClick={this.props.onClick}
        title={this.props.Text}
      />
    </ErrorBoundary>
    );
  }

  private StandardButton() {
    return (<ErrorBoundary>
      <button
        className={this.props.className}
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDblclick}
        onMouseUp={this.props.MouseUp}
        onMouseDown={this.props.MouseDown}
        title={this.props.HoverText}
        onContextMenu={this.rightClick}>{this.props.Text}
      </button>
    </ErrorBoundary>
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

