import type { Command } from 'commander';
import type { CliContext } from '../types';
import { listCommand } from '../types';

export function topRated(program: Command, ctx: CliContext): void {
  listCommand(program, ctx, 'top-rated', 'top_rated', '高分电影（/movie/top_rated）');
}