import fs from "fs";
import pdf from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
  try {
    if (!buffer) return { text: "" };
    const data = await pdf(buffer);
    return { text: data.text };
  } catch (error) {
    console.error(error.message);
    return { text: "" };
  }
};
