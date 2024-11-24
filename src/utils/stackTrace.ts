/**
 * Parses a JavaScript stack trace string into an array of stack frame objects.
 * Extracts file name, line number, and column number from each stack frame.
 * @param stack - The stack trace as a string. Can be undefined.
 * @returns An array of parsed stack frames, or `null` if the stack is undefined or invalid.
 */
export function parseStackTrace(
  stack: string | undefined
): { file: string; line: number; column: number }[] | null {
  if (!stack) return null;

  const stackLines = stack.split("\n").slice(1);
  const stackFrames = stackLines
    .map((line) => {
      const match = line.match(/(?:at\s+)?(?:.*?\s+)?(?:\()?(.+?):(\d+):(\d+)/);
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
