import React from 'react';
import { render } from 'ink';
import App from './App';
import { runCli } from './cli';
import { core } from './core';

const args = process.argv.slice(2);

if (args.length === 0) {
  render(<App />);
} else {
  void (async () => {
    const { stdout, stderr, exitCode } = await runCli(args, core);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    process.exit(exitCode);
  })();
}