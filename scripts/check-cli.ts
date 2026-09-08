import { runCli } from '../src/cli';
import type { Core } from '../src/core';

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(msg);
};

const calls: Record<string, unknown[]> = {};
const cast = [{ name: 'Actor A', character: 'Role', order: 0 }];

const fakeCore = {
  search: async (q: unknown, p: unknown) => {
    calls.search = [q, p];
    return [{ id: 1, title: 'Test Movie' }];
  },
  list: async (key: unknown, p: unknown) => {
    calls.list = [key, p];
    return [{ id: 2, title: 'Top Movie' }];
  },
  movie: async (id: unknown, p: unknown) => {
    calls.movie = [id, p];
    return { id: 3, title: 'Detail', credits: { cast, crew: [] } };
  },
  credits: async (id: unknown, p: unknown) => {
    calls.credits = [id, p];
    return { cast, crew: [] };
  },
} as unknown as Core;

const core = fakeCore;

// search：JSON + exit 0
const r1 = await runCli(['search', 'hello'], core);
assert(r1.exitCode === 0, `search 应 exit 0，实际 ${r1.exitCode}`);
assert(JSON.parse(r1.stdout)[0].title === 'Test Movie', 'search 应输出 JSON');

// --language 透传
await runCli(['search', 'hello', '--language', 'en-US'], core);
assert((calls.search[1] as { language?: string }).language === 'en-US', 'search 应透传 --language');

// --pretty 美化
const r2 = await runCli(['search', 'hello', '--pretty'], core);
assert(r2.stdout.startsWith('[\n'), '--pretty 应美化缩进');

// 空结果 → [] + exit 0
const emptyCore = { ...fakeCore, search: async () => [] } as unknown as Core;
const r3 = await runCli(['search', 'nothing'], emptyCore);
assert(r3.exitCode === 0, '空结果应 exit 0');
assert(JSON.parse(r3.stdout).length === 0, '空结果应为空数组');

// 坏命令 → exit 2
const r4 = await runCli(['bogus'], core);
assert(r4.exitCode === 2, `坏命令应 exit 2，实际 ${r4.exitCode}`);

// core 运行错误 → exit 1 + stderr
const failCore = {
  ...fakeCore,
  search: async () => {
    throw new Error('boom');
  },
} as unknown as Core;
const r5 = await runCli(['search', 'x'], failCore);
assert(r5.exitCode === 1, `运行错误应 exit 1，实际 ${r5.exitCode}`);
assert(r5.stderr.includes('boom'), 'stderr 应包含错误信息');

// 榜单：key 正确 + --page/--region 透传
const r6 = await runCli(['popular', '--page', '3', '--region', 'US'], core);
assert(r6.exitCode === 0, 'popular 应 exit 0');
assert(calls.list[0] === 'popular', `popular 应传 key=popular，实际 ${String(calls.list[0])}`);
assert((calls.list[1] as { page?: number }).page === 3, '榜单应透传 --page');
assert((calls.list[1] as { region?: string }).region === 'US', '榜单应透传 --region');

await runCli(['top-rated'], core);
assert(calls.list[0] === 'top_rated', `top-rated 应传 key=top_rated，实际 ${String(calls.list[0])}`);

// movie：内嵌 credits
const r7 = await runCli(['movie', '550'], core);
assert(r7.exitCode === 0, 'movie 应 exit 0');
const movieJson = JSON.parse(r7.stdout);
assert(movieJson.title === 'Detail', 'movie 应输出详情 JSON');
assert(movieJson.credits.cast[0].name === 'Actor A', 'movie 应内嵌 credits');

// credits：全量 cast
const r8 = await runCli(['credits', '550'], core);
assert(r8.exitCode === 0, 'credits 应 exit 0');
assert(JSON.parse(r8.stdout).cast[0].name === 'Actor A', 'credits 应输出 cast');

// 非数字 id → 用法错误 exit 2
const r9 = await runCli(['movie', 'abc'], core);
assert(r9.exitCode === 2, `非数字 id 应 exit 2，实际 ${r9.exitCode}`);

// movie 失败 → exit 1
const failMovie = {
  ...fakeCore,
  movie: async () => {
    throw new Error('not found');
  },
} as unknown as Core;
const r10 = await runCli(['movie', '99999999'], failMovie);
assert(r10.exitCode === 1, `movie 失败应 exit 1，实际 ${r10.exitCode}`);

console.log('check-cli OK');