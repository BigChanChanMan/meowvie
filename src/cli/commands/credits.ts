import type { Command } from 'commander';
import type { CliContext } from '../types';
import { idCommand } from '../types';

export function credits(program: Command, ctx: CliContext): void {
  idCommand(program, ctx, 'credits', '演职员表（/movie/{id}/credits，全量 cast + crew）', (id, params) =>
    ctx.core.credits(id, params),
  );
}