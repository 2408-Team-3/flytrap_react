export type RejectionValue = string | number | object | null;

export interface ErrorData {
  name: string;
  message: string;
  stack: string | undefined;
}

export interface LogData {
  error?: ErrorData;
  value?: RejectionValue;
  codeContexts?: CodeContext[];
  handled: boolean;
  timestamp: string;
  project_id: string;
}

export interface CodeContext {
  file: string;
  line: number;
  column: number;
  context: string;
}
