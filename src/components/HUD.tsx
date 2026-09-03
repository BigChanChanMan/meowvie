import React from 'react';
import { Text, Box } from 'ink';
import type { Language } from '@lorenzopant/tmdb';
import { langLabel, protocolLabel, YELLOW } from '../config';
import type { PosterProtocol } from '../config';
import User from './User';

type Props = { lang: Language; posterProtocol: PosterProtocol };

export default function HUD({ lang, posterProtocol }: Props) {
  return (
    <Box width="100%" justifyContent="space-between" paddingBottom={1}>
      <Box>
        <User />
        <Text>
          🌐 <Text color={YELLOW} bold>{langLabel(lang)}</Text>
          <Text dimColor> ({lang})</Text>
          {'   '}🎨{' '}
          <Text color={YELLOW} bold>{protocolLabel(posterProtocol)}</Text>
        </Text>
      </Box>
      <Text dimColor>Tab 设置</Text>
    </Box>
  );
}
