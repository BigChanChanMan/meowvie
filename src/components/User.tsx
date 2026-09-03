import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { tmdb, ACCOUNT_ID, YELLOW } from '../config';

export default function User() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!tmdb || !Number.isFinite(ACCOUNT_ID)) return;
    (async () => {
      try {
        const profile = await tmdb.account.details({ account_id: ACCOUNT_ID });
        setUsername(profile.username || profile.name || String(profile.id));
      } catch {
        setUsername(''); // 获取失败则隐藏
      }
    })();
  }, []);

  if (username === '') return null;

  return (
    <Text>
      👤 <Text color={YELLOW} bold>{username ?? '…'}</Text>
      {'   '}
    </Text>
  );
}
