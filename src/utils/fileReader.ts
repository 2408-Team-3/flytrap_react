import axios from "axios";

export const readSourceFile = async (
  filePath: string,
): Promise<string | null> => {
  const cleanedPath = filePath.replace(/^[^(]*\(/, "").replace(/\)$/, "");

  try {
    const response = await axios.get(cleanedPath, { responseType: "text" });
    return response.data;
  } catch (error) {
    console.warn("[flytrap] Could not read source file:", filePath, error);
    return null;
  }
};
