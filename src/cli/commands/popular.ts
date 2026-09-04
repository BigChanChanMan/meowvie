import type { Command } from 'commander';
import type { CliContext } from '../types';
import { listCommand } from '../types';

export function popular(program: Command, ctx: CliContext): void {
  listCommand(program, ctx, 'popular', 'popular', '热门电影（/movie/popular）');
}