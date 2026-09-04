import { creditsLines } from '../src/config';
import type { Detail } from '../src/config';

const cast = Array.from({ length: 12 }, (_, i) => ({
  name: `Actor${i}`,
  character: `Char${i}`,
  order: 11 - i,
}));

const crew = [
  { name: 'Dir', job: 'Director', department: 'Directing' },
  { name: 'Wr', job: 'Writer', department: 'Writing' },
  { name: 'Prod', job: 'Producer', department: 'Production' },
  { name: 'Editor', job: 'Editor', department: 'Editing' },
];

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(msg);
};

const detail = { credits: { cast, crew } } as unknown as Detail;
const lines = creditsLines(detail);

assert(lines[0] === '导演：Dir', `导演: ${lines[0]}`);
assert(lines[1] === '编剧：Wr', `编剧: ${lines[1]}`);
assert(lines[2] === '制片：Prod', `制片: ${lines[2]}`);
assert(lines[4] === '演员：', `演员标题: ${lines[4]}`);
// order 升序：Actor11（order 0）应排第一，Actor2（order 9）为第 10 名
assert(lines[5] === '  Actor11 — Char11', `首个演员: ${lines[5]}`);
assert(lines[14] === '  Actor2 — Char2', `第 10 名演员: ${lines[14]}`);
assert(lines.length === 15, `行数 15: ${lines.length}`);
assert(!lines.some((l) => l.includes('Editor')), '非核心职员不应出现');

console.log('check-credits OK: 15 lines');