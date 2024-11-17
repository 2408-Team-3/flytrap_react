export function parseStackTrace(stack: string | undefined) {
  if (!stack) return;

  const stackLines = stack.split("\n").slice(1); // Skip the error message
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
