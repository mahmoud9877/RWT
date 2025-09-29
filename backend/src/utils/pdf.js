// utils/pdfReaderStandalone.js
import fs from "fs";

/**
 * Basic PDF text extractor (no external dependencies)
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return { text: "" };
    }

    const buffer = fs.readFileSync(filePath);

    // تحويل البايتات لسلسلة نصية
    const pdfText = buffer
      .toString("latin1") // تحويل البايتات لنص
      .replace(/\r\n/g, "\n") // توحيد نهاية الأسطر
      .replace(/(\n\s)+/g, "\n") // إزالة المسافات الزائدة
      .replace(/[^ -~\n]+/g, ""); // إزالة الأحرف غير النصية غالبًا الرموز الثنائية

    return { text: pdfText };
  } catch (error) {
    console.error("Error extracting PDF text:", error.message);
    return { text: "" };
  }
};

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer - PDF file as a buffer
 * @returns {Promise<{text: string}>}
 */
export const extractTextFromPDFBuffer = async (buffer) => {
  try {
    if (!buffer) return { text: "" };

    const pdfText = buffer
      .toString("latin1")
      .replace(/\r\n/g, "\n")
      .replace(/(\n\s)+/g, "\n")
      .replace(/[^ -~\n]+/g, "");

    return { text: pdfText };
  } catch (error) {
    console.error("Error extracting PDF text from buffer:", error.message);
    return { text: "" };
  }
};
