import { init } from "./config";
import { captureException } from "./logger/captureException";
import { FlytrapError } from "./utils/FlytrapError";
import { ErrorBoundary } from "./react/ErrorBoundary";

const flytrap = {
  init,
  captureException,
  FlytrapError,
  ErrorBoundary,
};

export default flytrap;
