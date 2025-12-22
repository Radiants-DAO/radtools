#!/usr/bin/env node
import('../dist/cli/index.js').catch((error) => {
  console.error('Failed to load RadTools CLI:', error.message);
  process.exit(1);
});
