import type { Command } from 'commander';
import type { CliContext } from '../types';
import { idCommand } from '../types';

export function movie(program: Command, ctx: CliContext): void {
  idCommand(program, ctx, 'movie', '电影详情（/movie/{id}，内嵌 credits）', (id, params) =>
    ctx.core.movie(id, params),
  );
}