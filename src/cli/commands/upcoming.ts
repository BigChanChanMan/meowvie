import type { Command } from 'commander';
import type { CliContext } from '../types';
import { listCommand } from '../types';

export function upcoming(program: Command, ctx: CliContext): void {
  listCommand(program, ctx, 'upcoming', 'upcoming', '即将上映（/movie/upcoming）');
}