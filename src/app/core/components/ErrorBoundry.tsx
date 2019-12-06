import * as React from "react";
import { log } from "../../core/util/Logger";
// https://reactjs.org/docs/error-boundaries.html

export class ErrorBoundary extends React.Component<{}, { hasError: boolean, Error: any }> {

  public static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, Error: error };
  }
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, Error: null };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    try {
      log(error.stack);
      log(error.message);
      log("Component Stack: " + errorInfo.componentStack);
    // tslint:disable-next-line: no-console
    } catch (e) { console.log(e); }
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <React.Fragment>
        {/* <div>Something went wrong.</div> */}
        <div className="hidden error">{this.state.Error.message}</div>
        <div className="hidden error">{this.state.Error.stack}</div>
      </React.Fragment>;
    }
    return this.props.children;
  }
}
