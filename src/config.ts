import { TMDB, ImageAPI } from '@lorenzopant/tmdb';
import type { Language } from '@lorenzopant/tmdb';
import figlet from 'figlet';

// 从项目根目录 .env 加载（不覆盖已存在的环境变量）
try {
  process.loadEnvFile();
} catch {}

const TOKEN = process.env.TMDB_ACCESS_TOKEN;
export const tmdb = TOKEN ? new TMDB(TOKEN) : null;
export const images = new ImageAPI();
export const ACCOUNT_ID = Number(process.env.TMDB_ACCOUNT_ID); // 从 .env 读取，未配置时为 NaN

export const YELLOW = '#f5c518'; // IMDb 黄

export const banner = (() => {
  try {
    return figlet.textSync('IMDb', { font: 'ANSI Shadow' });
  } catch {
    return figlet.textSync('IMDb'); // 兜底默认字体
  }
})();

export const LANGS: { label: string; code: Language }[] = [
  { label: '中文', code: 'zh-CN' },
  { label: 'English', code: 'en-US' },
  { label: '日本語', code: 'ja-JP' },
  { label: '한국어', code: 'ko-KR' },
];

export const POSTER_PROTOCOLS = [
  { id: 'auto', label: '自动（真图）' },
  { id: 'halfBlock', label: '半块（彩色）' },
  { id: 'braille', label: '盲文（灰阶）' },
] as const;
export type PosterProtocol = (typeof POSTER_PROTOCOLS)[number]['id'];

export const BOARDS = [
  { key: 'popular', label: '热门电影' },
  { key: 'top_rated', label: '高分电影' },
  { key: 'now_playing', label: '正在上映' },
  { key: 'upcoming', label: '即将上映' },
] as const;
export type BoardKey = (typeof BOARDS)[number]['key'];

export function langLabel(code: Language): string {
  return LANGS.find((l) => l.code === code)?.label ?? code;
}

export function protocolLabel(p: PosterProtocol): string {
  return POSTER_PROTOCOLS.find((x) => x.id === p)?.label ?? p;
}

export function starBar(score: number): string {
  const filled = Math.round(score / 2); // 0-10 → 0-5 星
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export function fmtRuntime(min?: number): string {
  if (!min) return '—';
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}
