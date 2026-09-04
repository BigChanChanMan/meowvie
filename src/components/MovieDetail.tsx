import React from 'react';
import { Text, Box, useWindowSize } from 'ink';
import Image from 'ink-picture';
import { images, starBar, fmtRuntime, YELLOW, visibleCredits } from '../config';
import type { PosterProtocol, Detail, DetailTab } from '../config';

type Props = { detail: Detail; posterProtocol: PosterProtocol; tab: DetailTab; scroll: number };

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'overview', label: '简介' },
  { key: 'credits', label: '演职员表' },
];

export default function MovieDetail({ detail, posterProtocol, tab, scroll }: Props) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        {TABS.map((t, i) => (
          <Box key={t.key} marginRight={i < TABS.length - 1 ? 3 : 0}>
            <Text bold={tab === t.key} color={tab === t.key ? YELLOW : undefined}>
              [{t.label}]
            </Text>
          </Box>
        ))}
      </Box>

      {tab === 'overview' ? (
        <Overview detail={detail} posterProtocol={posterProtocol} />
      ) : (
        <Credits detail={detail} scroll={scroll} />
      )}

      <Box marginTop={1}>
        <Text dimColor>←→ 切换面板 · ↑↓ 滚动 · Esc/Enter 返回列表</Text>
      </Box>
    </Box>
  );
}

function Overview({ detail, posterProtocol }: { detail: Detail; posterProtocol: PosterProtocol }) {
  return (
    <Box flexDirection="row">
      <Box marginRight={6} flexDirection="column">
        {detail.poster_path ? (
          <Image
            src={images.poster(detail.poster_path, 'w342')}
            width={20}
            height={15}
            objectFit="contain"
            protocol={posterProtocol === 'auto' ? undefined : posterProtocol}
            alt={detail.title}
          />
        ) : (
          <Text dimColor>[无海报]</Text>
        )}
      </Box>

      <Box flexDirection="column" flexGrow={1}>
        <Text bold color="white">
          {detail.title}
        </Text>
        {detail.tagline && (
          <Text italic color={YELLOW}>
            “{detail.tagline}”
          </Text>
        )}
        <Text dimColor>
          {detail.release_date?.slice(0, 4)} · {fmtRuntime(detail.runtime)} ·{' '}
          {detail.genres.map((g) => g.name).join(', ')}
        </Text>
        <Box marginTop={1}>
          <Text color={YELLOW}>{starBar(detail.vote_average)}</Text>
          <Text color="green">
            {' '}
            {detail.vote_average.toFixed(1)}/10
          </Text>
          <Text dimColor> ({detail.vote_count} 票)</Text>
        </Box>
        <Box marginTop={1} flexGrow={1}>
          <Text wrap="wrap">{detail.overview || '暂无简介'}</Text>
        </Box>
      </Box>
    </Box>
  );
}

function Credits({ detail, scroll }: { detail: Detail; scroll: number }) {
  const { rows } = useWindowSize();
  const visible = visibleCredits(detail, scroll, rows);
  return (
    <Box flexDirection="column">
      {visible.length === 0 ? (
        <Text dimColor>暂无演职员信息</Text>
      ) : (
        visible.map((line, i) => (
          <Text key={i} wrap="truncate">
            {line}
          </Text>
        ))
      )}
    </Box>
  );
}
