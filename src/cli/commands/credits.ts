import type { Command } from 'commander';
import type { CliContext, GlobalOptions } from '../types';
import { coreParams, emitJson } from '../types';

export function credits(program: Command, ctx: CliContext): void {
  program
    .command('credits')
    .description('演职员表（/movie/{id}/credits，全量 cast + crew）')
    .argument('<id>', 'TMDB 电影 ID', (v: string) => parseInt(v, 10))
    .option('--language <code>', '语言（ISO 639-1，默认 zh-CN）', 'zh-CN')
    .option('--pretty', '美化 JSON 缩进')
    .action((id: number, options: GlobalOptions) =>
      emitJson(ctx, ctx.core.credits(id, coreParams(options)), options.pretty),
    );
}