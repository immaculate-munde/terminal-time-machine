import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Summarizes a git diff and its commit message into a single sentence using Gemini 1.5 Flash.
 * 
 * @param {string} commitMessage - The git commit message.
 * @param {string} diffString - The git diff string.
 * @returns {Promise<string>} - A 1-sentence summary of the changes.
 */
export async function summarizeDiff(commitMessage, diffString) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Summarize the following git changes into a single, concise sentence.
    
    Commit Message: ${commitMessage}
    
    Diff:
    ${diffString}
    
    Return ONLY the 1-sentence summary.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
