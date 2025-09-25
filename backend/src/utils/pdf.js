import pdf from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return { text: data.text };
    } catch (error) {
        console.error("Error extracting PDF text:", error.message);
        throw new Error("Failed to extract text from PDF.");
    }
};
