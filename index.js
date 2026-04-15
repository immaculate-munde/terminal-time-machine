#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { getRecentCommits } from './gitHelper.js';
import Timeline from './Timeline.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Main application entry point.
 */
async function main() {
  try {
    const commits = await getRecentCommits();
    render(<Timeline commits={commits} />);
  } catch (error) {
    console.error('Failed to initialize Git Timeline:', error);
    process.exit(1);
  }
}

main();
