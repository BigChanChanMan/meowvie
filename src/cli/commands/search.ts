import type { Command } from 'commander';
import type { CliContext, GlobalOptions } from '../types';
import { coreParams, emitJson } from '../types';

export function search(program: Command, ctx: CliContext): void {
  program
    .command('search')
    .description('搜索电影（对应 /search/movie）')
    .argument('<query>', '搜索关键词')
    .option('--language <code>', '语言（ISO 639-1，默认 zh-CN）', 'zh-CN')
    .option('--page <n>', '页码', (v: string) => parseInt(v, 10))
    .option('--region <code>', '地区（ISO 3166-1）')
    .option('--pretty', '美化 JSON 缩进')
    .action((query: string, options: GlobalOptions) =>
      emitJson(ctx, ctx.core.search(query, coreParams(options)), options.pretty),
    );
}