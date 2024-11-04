import React, { ErrorInfo, ReactNode } from "react";
import Flytrap from "./index"; 

interface ErrorBoundaryProps {
  flytrap: Flytrap,
  children: ReactNode,
  fallback?: ReactNode,
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private flytrap: Flytrap;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.flytrap = props.flytrap;
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.flytrap.handleErrorBoundaryError(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}