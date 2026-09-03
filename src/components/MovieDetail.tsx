import React from 'react';
import { Text, Box } from 'ink';
import Image from 'ink-picture';
import type { MovieDetails } from '@lorenzopant/tmdb';
import { images, starBar, fmtRuntime, YELLOW } from '../config';
import type { PosterProtocol } from '../config';

type Props = { detail: MovieDetails; posterProtocol: PosterProtocol };

export default function MovieDetail({ detail, posterProtocol }: Props) {
  return (
    <Box flexDirection="column">
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
      <Box marginTop={1}>
        <Text dimColor>Esc / Enter 返回列表</Text>
      </Box>
    </Box>
  );
}
