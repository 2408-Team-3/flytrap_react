import axios from "axios";
// import sourceMapSupport from "source-map-support";
import { LogData, RejectionValue, CodeContext } from "./types/types";
import { FlytrapError } from "./utils/FlytrapError";
import { ErrorBoundary } from "./ErrorBoundary";

class Flytrap {
  private projectId: string;
  private apiEndpoint: string;
  private apiKey: string;
  private includeContext: boolean;

  constructor(config: {
    projectId: string;
    apiEndpoint: string;
    apiKey: string;
  }) {
    this.projectId = config.projectId;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.includeContext = true;
    this.setupGlobalErrorHandlers();
    // sourceMapSupport.install({ environment: "browser" });
  }

  public captureException(e: Error): void {
    this.logError(e, true);
  }

  public handleErrorBoundaryError(
    error: Error,
    stack: string | null | undefined,
  ): void {
    console.log("from handleErrorBoundaryError - stack: ", stack);

    this.logError(error, false);
  }

  // * --- Private Methods --- * //
  private setupGlobalErrorHandlers(): void {
    window.addEventListener("error", (e: ErrorEvent) =>
      this.handleUncaughtException(e),
    );
    window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) =>
      this.handleUnhandledRejection(e),
    );
  }

  private handleUncaughtException(e: ErrorEvent): void {
    if (e.error) {
      if (e.error instanceof FlytrapError) return;
      console.log('error from window on error')
      this.logError(e.error, false);
    }
  }

  private handleUnhandledRejection(e: PromiseRejectionEvent): void {
    const { reason } = e;

    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      this.logError(reason, false);
    } else {
      this.logRejection(reason, false);
    }
  }

  private async logError(error: Error, handled: boolean): Promise<void> {
    if(!error) return;

    const stackFrames = this.parseStackTrace(error.stack);
    console.log('stack frames:')
    console.log(stackFrames);

    let codeContexts: CodeContext[] = [];
    if (this.includeContext && stackFrames) {
      const contexts = await Promise.all(
        stackFrames.map(async (frame) => {
          if (frame.file) {
            const source = await this.readSourceFile(frame.file);

            if (source) {
              const context = this.getCodeContext(source, frame.line);

              return {
                file: frame.file,
                line: frame.line,
                column: frame.column,
                context,
              };
            }
          }
          return null;
        })
      );
      codeContexts = contexts.filter(Boolean) as CodeContext[];
    }

    const data: LogData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      codeContexts,
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
    };

    console.log('Log Data:')
    console.log(data);

    try {
      console.log("[flytrap] Sending error to backend...");
      const response = await axios.post(
        `${this.apiEndpoint}/api/errors`,
        { data },
        { headers: { "x-api-key": this.apiKey } },
      );

      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      console.error("[flytrap] An error occurred sending error data:", e);
      throw new FlytrapError(
        "An error occurred logging error data.",
        e instanceof Error ? e : new Error(String(e)),
      );
    }
  }

  private async logRejection(
    value: RejectionValue,
    handled: boolean,
  ): Promise<void> {
    const data: LogData = {
      value,
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
    };

    try {
      console.log("[error sdk] Sending rejection to backend...");
      const response = await axios.post(
        `${this.apiEndpoint}/api/rejections`,
        { data },
        { headers: { "x-api-key": this.apiKey } },
      );

      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      console.error(
        "[error sdk] An error occurred sending rejection data:",
        e,
      );
      throw new Error("An error occurred logging rejection data.");
    }
  }

  private parseStackTrace(stack: string | undefined) {
    if (!stack) return;

    const stackLines = stack.split("\n").slice(1); // Skip the error message
    const regex = /(?:at\s+)?(?:.*?\s+)?(?:\()?(.+?):(\d+):(\d+)/;
    const stackFrames = stackLines
      .map((line) => {
        const match = line.match(regex);
        if (match) {
          const [, file, line, column] = match;

          return {
            file,
            line: parseInt(line, 10),
            column: parseInt(column, 10),
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 10) as { file: string; line: number; column: number }[];

    return stackFrames;
  }

  private async readSourceFile(filePath: string): Promise<string | null> {
    try {
      const cleanedPath = filePath.replace(/^[^(]*\(/, "").replace(/\)$/, "");
      console.log("[flytrap] Fetching source file:", cleanedPath);

      const response = await fetch(cleanedPath);
      if (!response.ok) throw new Error(`Failed to fetch file: ${filePath}`);
      return await response.text();
    } catch (error) {
      console.error("[flytrap] Could not fetch source file:", filePath, error);
      return null;
    }
  }

  private getCodeContext(source: string, lineNumber: number, contextLines: number = 5): string {
    const lines = source.split("\n");
    const start = Math.max(0, lineNumber - contextLines - 1);
    const end = Math.min(lines.length, lineNumber + contextLines);
    return lines.slice(start, end).join("\n");
  }

  static ErrorBoundary: typeof ErrorBoundary;
}

Flytrap.ErrorBoundary = ErrorBoundary;

export default Flytrap;
