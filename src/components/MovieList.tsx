import React from 'react';
import { Text, Box } from 'ink';
import type { MovieResultItem } from '@lorenzopant/tmdb';
import { YELLOW } from '../config';

type Props = {
  title: string;
  items: MovieResultItem[];
  selected: number;
  busy: boolean;
};

export default function MovieList({ title, items, selected, busy }: Props) {
  return (
    <Box flexDirection="column">
      <Text bold color={YELLOW}>
        {title}
      </Text>
      <Text dimColor>↑↓ 选择 · Enter 查看详情 · Esc 返回</Text>
      <Box flexDirection="column" marginTop={1}>
        {items.length === 0 && !busy && <Text>没有找到相关电影</Text>}
        {items.map((r, i) => {
          const active = i === selected;
          const year = r.release_date ? r.release_date.slice(0, 4) : '—';
          return (
            <Box key={r.id}>
              <Text color={YELLOW}>{active ? '❯ ' : '  '}</Text>
              <Text bold={active} color={active ? 'white' : undefined}>
                {r.title}
              </Text>
              <Text dimColor> ({year})</Text>
              <Text color="#e5c07b">
                {' '}
                ★ {r.vote_average ? r.vote_average.toFixed(1) : '—'}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
