import React from 'react';
import { Text, Box } from 'ink';
import { banner, YELLOW } from '../config';

export default function Banner() {
  return (
    <Box width="100%" alignItems="center" flexDirection="column" paddingBottom={1}>
      <Box backgroundColor="black" paddingX={2}>
        <Text color={YELLOW} bold>
          {banner}
        </Text>
      </Box>
    </Box>
  );
}
