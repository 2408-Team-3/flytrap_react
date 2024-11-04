export default class Flytrap {
  private projectId: string;
  private apiEndpoint: string;
  private apiKey: string;
  
  constructor(config: {
    projectId: string;
    apiEndpoint: string;
    apiKey: string;
  }) {
    this.projectId = config.projectId;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.setupGlobalErrorHandlers();
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
}