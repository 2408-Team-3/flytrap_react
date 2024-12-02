/**
 * A WeakSet to track logged errors and prevent duplicate reporting.
 */
const loggedErrors = new WeakSet<Error>();

export default loggedErrors;
