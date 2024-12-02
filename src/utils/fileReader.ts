import axios from "axios";

/**
 * Reads the content of a source file asynchronously via an HTTP GET request.
 * @param filePath - The URL or path to the source file.
 * @returns A promise resolving to the file content as a string, or `null` if the file cannot be read.
 */
export const readSourceFile = async (
  filePath: string,
): Promise<string | null> => {
  const cleanedPath = filePath.replace(/^[^(]*\(/, "").replace(/\)$/, "");

  try {
    const response = await axios.get(cleanedPath, { responseType: "text" });
    return response.data;
  } catch {
    return null;
  }
};
