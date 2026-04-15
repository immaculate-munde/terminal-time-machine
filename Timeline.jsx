import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, Newline, Spacer } from 'ink';
import { getCommitDiff } from './gitHelper.js';
import { summarizeDiff } from './aiHelper.js';

/**
 * Enhanced Git Timeline with AI Summary and File Details.
 * 
 * @param {Object} props
 * @param {Array<{hash: string, author: string, date: string, message: string}>} props.commits
 */
export default function Timeline({ commits = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [details, setDetails] = useState({ summary: '', files: [], loading: false });

  // Update selection
  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(commits.length - 1, prev + 1));
    }
  });

  // Fetch details when selectedIndex changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (commits.length === 0) return;
      
      setDetails({ summary: 'Generating summary...', files: [], loading: true });
      const currentCommit = commits[selectedIndex];

      try {
        const { diff, files } = await getCommitDiff(currentCommit.hash);
        const summary = await summarizeDiff(currentCommit.message, diff);
        setDetails({ summary, files, loading: false });
      } catch (error) {
        setDetails({ summary: `Error: ${error.message}`, files: [], loading: false });
      }
    };

    fetchDetails();
  }, [selectedIndex, commits]);

  if (commits.length === 0) {
    return <Box padding={1}><Text color="yellow">No commits to display.</Text></Box>;
  }

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Text bold underline color="cyan">TERMINAL TIME MACHINE - GIT TIMELINE</Text>
      <Box flexDirection="row" marginTop={1}>
        {/* COMMIT LIST PANEL */}
        <Box flexDirection="column" width="40%" borderStyle="single" paddingRight={1}>
          <Text bold color="yellow">Select a Commit:</Text>
          {commits.map((commit, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Box key={commit.hash}>
                <Text color={isSelected ? 'green' : undefined} bold={isSelected} wrap="truncate">
                  {isSelected ? '➤' : ' '} [{commit.hash.slice(0, 7)}] {commit.message}
                </Text>
              </Box>
            );
          })}
        </Box>

        {/* DETAILS PANEL */}
        <Box flexDirection="column" width="60%" paddingLeft={2}>
          <Text bold color="yellow">Commit Details:</Text>
          <Box flexDirection="column" marginTop={1}>
            <Text bold color="magenta">AI Summary:</Text>
            <Text italic color="white">"{details.summary}"</Text>
            
            <Newline />
            
            <Text bold color="magenta">Files Modified:</Text>
            {details.files.length > 0 ? (
              details.files.map(file => (
                <Text key={file} color="gray">  • {file}</Text>
              ))
            ) : (
              <Text color="dim">  None detected.</Text>
            )}
          </Box>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="dim">Use ↑/↓ to navigate. Press Ctrl+C to exit.</Text>
      </Box>
    </Box>
  );
}
