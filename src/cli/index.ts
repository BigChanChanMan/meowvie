import { Command, CommanderError } from 'commander';
import type { Core } from '../core';
import { search } from './commands/search';
import type { CliContext, CliResult } from './types';

export async function runCli(argv: string[], core: Core): Promise<CliResult> {
  let stdout = '';
  let stderr = '';
  let failure: unknown = null;

  const ctx: CliContext = {
    core,
    out: (s) => {
      stdout += s;
    },
    fail: (e) => {
      failure = e;
    },
  };

  const program = new Command();
  program
    .name('meowvie')
    .description('TMDB 电影查询命令行')
    .exitOverride()
    .configureOutput({
      writeOut: (s: string) => {
        stdout += s;
      },
      writeErr: (s: string) => {
        stderr += s;
      },
    });

  search(program, ctx);

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (err) {
    if (err instanceof CommanderError) {
      if (err.code === 'commander.helpDisplayed' || err.code === 'commander.help') {
        return { stdout, stderr, exitCode: 0 };
      }
      return { stdout, stderr, exitCode: 2 };
    }
    failure = err;
  }

  if (failure !== null) {
    const msg = failure instanceof Error ? failure.message : String(failure);
    stderr += msg + '\n';
    return { stdout, stderr, exitCode: 1 };
  }

  return { stdout, stderr, exitCode: 0 };
}