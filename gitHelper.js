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
