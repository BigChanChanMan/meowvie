import type { Command } from 'commander';
import type { CliContext, GlobalOptions } from '../types';
import { coreParams, emitJson } from '../types';

export function movie(program: Command, ctx: CliContext): void {
  program
    .command('movie')
    .description('电影详情（/movie/{id}，内嵌 credits）')
    .argument('<id>', 'TMDB 电影 ID', (v: string) => parseInt(v, 10))
    .option('--language <code>', '语言（ISO 639-1，默认 zh-CN）', 'zh-CN')
    .option('--pretty', '美化 JSON 缩进')
    .action((id: number, options: GlobalOptions) =>
      emitJson(ctx, ctx.core.movie(id, coreParams(options)), options.pretty),
    );
}