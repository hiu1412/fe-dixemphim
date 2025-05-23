"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Đã có lỗi xảy ra</h2>
              <p className="text-muted-foreground">
                {this.state.error?.message || "Vui lòng thử lại sau"}
              </p>
            </div>
            <Button onClick={this.handleRetry}>Thử lại</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}