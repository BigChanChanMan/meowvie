import type { Command } from 'commander';
import type { CliContext } from '../types';
import { listCommand } from '../types';

export function nowPlaying(program: Command, ctx: CliContext): void {
  listCommand(program, ctx, 'now-playing', 'now_playing', '正在上映（/movie/now_playing）');
}