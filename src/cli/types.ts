import type { Language, CountryISO3166_1 } from '@lorenzopant/tmdb';
import type { Core, CoreParams } from '../core';

export type CliContext = {
  core: Core;
  out: (s: string) => void;
  fail: (e: unknown) => void;
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