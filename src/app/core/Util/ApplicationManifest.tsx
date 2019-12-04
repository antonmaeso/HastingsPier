// all Imports are here for all root components
import * as React from "react";
import { AppSelection } from "../../modules/ApplicationSelection/appSelection";
import { Example } from "../../modules/Example/example";
import { OctaneParent } from "../../modules/OctaneBurner/OctaneParent";
import { RmDash } from "../../modules/RmDashboard/RmDash";
import { Google } from "../../modules/StackoverFlow/StackOverflow";
import { Tapestry } from "../../modules/Tapestry/Tapestry";
import { VideoRecording } from "../../modules/VideoRecording/VideoRecording";

/**
 * @param root React component which serves as the foundation for your app
 * @param description Description of your app which is displayed on the app selction window. Try to keep it <120 chars
 * @param title The title Pier should show when your application is loaded
 */
class App {
  public root: JSX.Element;
  public description: string;
  public title: string;

  constructor(component: JSX.Element, description: string, title: string) {
    this.root = component;
    this.description = description;
    this.title = title;
  }
}
// add your component to the map. The Key is assigned as the class to your apps selection pane and
// its icon in the appBar
export const appMap = new Map<string, App>([
  [
    "ApplicationSelection",
    new App(
      <AppSelection />,
      "Default for selecting an app",
      "Hastings Pier"),
  ],
  [
    "Octane",
    new App(
      <OctaneParent />,
      "Burn down your Octane Tasks to keep accurate track of time taken",
      "Octane Burner"),
  ],
  [
    "BatManager",
    new App(
      <Example />,
      "For testing stuff as we develop",
      "Dev Experiments"),
  ],
  [
    "RmDashboard",
    new App(
      <RmDash />,
      "Show RM Dashboard in app",
      "RM Dashboard"),
  ],
  [
    "HastingsTapestry",
    new App(
      <Tapestry />,
      "Load Tapestry",
      "Tapestry"),
  ],
  ["Google",
    new App(
      <Google />,
      "Show google",
      "Loading Google"),
  ],
  ["VideoRecording",
    new App(
      <VideoRecording />,
      "Record videos of your pc",
      "Video Recording"),
  ],
]);
