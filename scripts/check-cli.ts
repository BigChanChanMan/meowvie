import { runCli } from '../src/cli';
import type { Core } from '../src/core';

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(msg);
};

const fakeCore = {
  search: async () => [{ id: 1, title: 'Test Movie' }],
  list: async () => [{ id: 2, title: 'Top Movie' }],
  movie: async () => ({ id: 3, title: 'Detail', credits: { cast: [], crew: [] } }),
  credits: async () => ({ cast: [], crew: [] }),
} as unknown as Core;

const core = fakeCore;

const r1 = await runCli(['search', 'hello'], core);
assert(r1.exitCode === 0, `search 应 exit 0，实际 ${r1.exitCode}`);
assert(JSON.parse(r1.stdout)[0].title === 'Test Movie', 'search 应输出 JSON');

const r2 = await runCli(['search', 'hello', '--pretty'], core);
assert(r2.stdout.startsWith('[\n'), '--pretty 应美化缩进');

const emptyCore = { ...fakeCore, search: async () => [] } as unknown as Core;
const r3 = await runCli(['search', 'nothing'], emptyCore);
assert(r3.exitCode === 0, '空结果应 exit 0');
assert(JSON.parse(r3.stdout).length === 0, '空结果应为空数组');

const r4 = await runCli(['bogus'], core);
assert(r4.exitCode === 2, `坏命令应 exit 2，实际 ${r4.exitCode}`);
assert(r4.stderr.length > 0, '坏命令应写 stderr');

const failCore = {
  ...fakeCore,
  search: async () => {
    throw new Error('boom');
  },
} as unknown as Core;
const r5 = await runCli(['search', 'x'], failCore);
assert(r5.exitCode === 1, `运行错误应 exit 1，实际 ${r5.exitCode}`);
assert(r5.stderr.includes('boom'), 'stderr 应包含错误信息');

console.log('check-cli OK');