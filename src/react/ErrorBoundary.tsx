import React, { ErrorInfo, ReactNode } from "react";
import { logError } from "../logger/logError";
import loggedErrors from "../shared/loggedErrors";

/**
 * Props for the ErrorBoundary component.
 * - `children`: ReactNode elements to render inside the boundary.
 * - `fallback`: Optional fallback UI to display when an error occurs.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 * - `hasError`: Indicates if an error has been caught.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React ErrorBoundary component to catch and handle JavaScript errors in its child components.
 * - Captures errors via `componentDidCatch` and updates state to render fallback UI.
 * - Logs errors using `logError` and prevents duplicate reporting with `loggedErrors`.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    loggedErrors.add(error);
    logError(error, false);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;;
    }

    return this.props.children;
  }
}
