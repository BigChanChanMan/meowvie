import React from 'react';
import { Text, Box } from 'ink';
import { YELLOW, BOARDS } from '../config';

export default function Home({ query }: { query: string }) {
  return (
    <Box flexDirection="column">
      <Text bold color="white">
        搜索电影
      </Text>
      <Box
        borderStyle="round"
        borderColor={YELLOW}
        paddingX={1}
        width={40}
        marginTop={1}
      >
        <Text color="cyan">🔍 </Text>
        {query ? (
          <Text>
            {query}
            <Text color={YELLOW}>▏</Text>
          </Text>
        ) : (
          <Text dimColor>
            输入电影名，例如 Inception
            <Text color={YELLOW}>▏</Text>
          </Text>
        )}
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text bold color="white">
          📊 排行榜
        </Text>
        {BOARDS.map((b, i) => (
          <Box key={b.key}>
            <Text color={YELLOW}>{i + 1}.</Text>
            <Text> {b.label}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Enter 搜索 · 1-4 榜单 · Tab 设置 · Ctrl+C 退出</Text>
      </Box>
    </Box>
  );
}
