import type { Command } from 'commander';
import type { Language, CountryISO3166_1 } from '@lorenzopant/tmdb';
import type { Core, CoreParams } from '../core';
import type { BoardKey } from '../config';

export type CliContext = {
  core: Core;
  out: (s: string) => void;
  fail: (e: unknown) => void;
  failUsage: (msg: string) => void;
};

export type CliResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export type GlobalOptions = {
  language?: string;
  page?: number;
  region?: string;
  pretty?: boolean;
};

export function coreParams(op: GlobalOptions): CoreParams {
  return {
    language: op.language as Language | undefined,
    page: op.page,
    region: op.region as CountryISO3166_1 | undefined,
  };
}

export function emitJson(ctx: CliContext, promise: Promise<unknown>, pretty?: boolean): Promise<void> {
  return promise.then(
    (data) => ctx.out(JSON.stringify(data, null, pretty ? 2 : 0) + '\n'),
    (e) => ctx.fail(e),
  );
}

export function listCommand(
  program: Command,
  ctx: CliContext,
  name: string,
  key: BoardKey,
  description: string,
): void {
  program
    .command(name)
    .description(description)
    .option('--language <code>', '语言（ISO 639-1，默认 zh-CN）', 'zh-CN')
    .option('--page <n>', '页码', (v: string) => parseInt(v, 10))
    .option('--region <code>', '地区（ISO 3166-1）')
    .option('--pretty', '美化 JSON 缩进')
    .action((options: GlobalOptions) =>
      emitJson(ctx, ctx.core.list(key, coreParams(options)), options.pretty),
    );
}

export function idCommand(
  program: Command,
  ctx: CliContext,
  name: string,
  description: string,
  fn: (id: number, params: CoreParams) => Promise<unknown>,
): void {
  program
    .command(name)
    .description(description)
    .argument('<id>', 'TMDB 电影 ID', (v: string) => parseInt(v, 10))
    .option('--language <code>', '语言（ISO 639-1，默认 zh-CN）', 'zh-CN')
    .option('--pretty', '美化 JSON 缩进')
    .action((id: number, options: GlobalOptions) => {
      if (Number.isNaN(id)) {
        ctx.failUsage('无效的电影 ID');
        return;
      }
      return emitJson(ctx, fn(id, coreParams(options)), options.pretty);
    });
}