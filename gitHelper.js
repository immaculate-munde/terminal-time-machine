import { simpleGit } from 'simple-git';

/**
 * Fetches the last 10 git commits from the current local repository.
 * @returns {Promise<Array<{hash: string, author: string, date: string, message: string}>>}
 */
export async function getRecentCommits() {
  const git = simpleGit();
  const log = await git.log({ maxCount: 10 });

  return log.all.map(commit => ({
    hash: commit.hash,
    author: commit.author_name,
    date: commit.date,
    message: commit.message,
  }));
}

/**
 * Gets the diff and list of modified files for a specific commit.
 * @param {string} hash - The commit hash.
 * @returns {Promise<{diff: string, files: string[]}>}
 */
export async function getCommitDiff(hash) {
  const git = simpleGit();
  // Show the diff for the specific commit (comparing to its parent)
  const diff = await git.show([hash, '--pretty=format:']);
  const showResult = await git.show([hash, '--name-only', '--pretty=format:']);
  const files = showResult.trim().split('\n').filter(Boolean);
  
  return { diff, files };
}
