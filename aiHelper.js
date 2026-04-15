import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

/**
 * Summarizes a git diff and its commit message using GitHub Models (GPT-4o mini).
 * 
 * @param {string} commitMessage - The git commit message.
 * @param {string} diffString - The git diff string.
 * @returns {Promise<string>} - A 1-sentence summary of the changes.
 */
export async function summarizeDiff(commitMessage, diffString) {
  // Use GITHUB_TOKEN or GEMINI_API_KEY (whichever you set for your GitHub Token)
  const token = process.env.GITHUB_TOKEN || process.env.GEMINI_API_KEY;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN not found in process.env');
  }

  const client = new ModelClient(
    'https://models.inference.ai.azure.com',
    new AzureKeyCredential(token)
  );

  const response = await client.path('/chat/completions').post({
    body: {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes git diffs into single, concise sentences.' },
        { 
          role: 'user', 
          content: `Summarize these changes into a single, concise sentence.\n\nCommit Message: ${commitMessage}\n\nDiff:\n${diffString}` 
        }
      ],
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 100
    }
  });

  if (response.status !== '200') {
    throw new Error(`GitHub Models Error: ${response.status} - ${response.body?.error?.message || 'Unknown Error'}`);
  }

  return response.body.choices[0].message.content.trim();
}
