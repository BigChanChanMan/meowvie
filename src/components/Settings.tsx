import React from 'react';
import { Text, Box } from 'ink';
import type { Language } from '@lorenzopant/tmdb';
import { langLabel, protocolLabel, YELLOW } from '../config';
import type { PosterProtocol } from '../config';

type Props = { settingsIndex: number; lang: Language; posterProtocol: PosterProtocol };

export default function Settings({ settingsIndex, lang, posterProtocol }: Props) {
  return (
    <Box flexDirection="column">
      <Text bold color="white">
        ⚙️ 设置
      </Text>
      <Box flexDirection="column" marginTop={1}>
        <Box>
          <Text color={YELLOW}>{settingsIndex === 0 ? '❯ ' : '  '}</Text>
          <Text bold={settingsIndex === 0} color={settingsIndex === 0 ? 'white' : undefined}>
            语言
          </Text>
          <Text dimColor>{'   '}{langLabel(lang)} ({lang})</Text>
        </Box>
        <Box>
          <Text color={YELLOW}>{settingsIndex === 1 ? '❯ ' : '  '}</Text>
          <Text bold={settingsIndex === 1} color={settingsIndex === 1 ? 'white' : undefined}>
            海报渲染
          </Text>
          <Text dimColor>{'   '}{protocolLabel(posterProtocol)}</Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>↑↓ 选择 · ←→ 切换 · Esc 退出</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>💡 真图最清晰，但退出详情可能残留遮挡；半块/盲文可干净清除</Text>
      </Box>
    </Box>
  );
}
