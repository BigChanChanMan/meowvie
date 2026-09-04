import React, { useState } from 'react';
import { Text, Box, useInput, useApp, useWindowSize } from 'ink';
import { InkPictureProvider } from 'ink-picture';
import type { MovieResultItem, Language } from '@lorenzopant/tmdb';
import { tmdb, LANGS, POSTER_PROTOCOLS, BOARDS, maxCreditsScroll } from './config';
import type { PosterProtocol, BoardKey, Detail, DetailTab } from './config';
import Banner from './components/Banner';
import HUD from './components/HUD';
import Settings from './components/Settings';
import Home from './components/Home';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';

type View = 'home' | 'settings' | 'list' | 'detail';
type ListSource = { type: 'search'; query: string } | { type: 'board'; key: BoardKey };

function App() {
  const [view, setView] = useState<View>('home');
  const [prevView, setPrevView] = useState<View>('home');

  const [query, setQuery] = useState('');
  const [listTitle, setListTitle] = useState('');
  const [items, setItems] = useState<MovieResultItem[]>([]);
  const [listSource, setListSource] = useState<ListSource | null>(null);
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [creditsScroll, setCreditsScroll] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lang, setLang] = useState<Language>('zh-CN');
  const [posterProtocol, setPosterProtocol] = useState<PosterProtocol>('halfBlock');
  const [settingsIndex, setSettingsIndex] = useState(0);

  const { exit } = useApp();
  const { rows } = useWindowSize();

  const runList = async (
    title: string,
    fetcher: (language: Language) => Promise<MovieResultItem[]>,
    language: Language,
  ) => {
    if (!tmdb) {
      setError('未配置 TMDB_ACCESS_TOKEN（编辑 .env 文件）');
      return;
    }
    setError(null);
    setBusy(true);
    setListTitle(title);
    setItems([]);
    setSelected(0);
    setView('list');
    try {
      setItems(await fetcher(language));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const search = (q: string, language: Language) => {
    setListSource({ type: 'search', query: q });
    void runList(
      `结果（${q}）`,
      (l) => tmdb!.search.movies({ query: q, language: l }).then((r) => r.results.slice(0, 8)),
      language,
    );
  };

  const loadBoard = (key: BoardKey, language: Language) => {
    setListSource({ type: 'board', key });
    const label = BOARDS.find((b) => b.key === key)!.label;
    void runList(
      `📊 ${label}`,
      (l) => tmdb!.movie_lists[key]({ language: l }).then((r) => r.results.slice(0, 10)),
      language,
    );
  };

  const openDetail = async (id: number, language: Language) => {
    if (!tmdb) return;
    setBusy(true);
    setError(null);
    try {
      setDetail(
        await tmdb.movies.details<['credits']>({
          movie_id: id,
          language,
          append_to_response: ['credits'],
        }),
      );
      setDetailTab('overview');
      setCreditsScroll(0);
      setView('detail');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const applyLanguage = (code: Language) => {
    setLang(code);
    // 若正在查看列表/详情，用新语言刷新
    const active = view === 'settings' ? prevView : view;
    if (active === 'detail' && detail) void openDetail(detail.id, code);
    else if (active === 'list' && listSource) {
      if (listSource.type === 'search') search(listSource.query, code);
      else loadBoard(listSource.key, code);
    }
  };

  const changeLang = (dir: 1 | -1) => {
    const idx = LANGS.findIndex((l) => l.code === lang);
    applyLanguage(LANGS[(idx + dir + LANGS.length) % LANGS.length].code);
  };

  const changeProtocol = (dir: 1 | -1) => {
    const idx = POSTER_PROTOCOLS.findIndex((p) => p.id === posterProtocol);
    setPosterProtocol(
      POSTER_PROTOCOLS[(idx + dir + POSTER_PROTOCOLS.length) % POSTER_PROTOCOLS.length].id,
    );
  };

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();

    // 设置页
    if (view === 'settings') {
      if (key.upArrow) setSettingsIndex((i) => Math.max(0, i - 1));
      else if (key.downArrow) setSettingsIndex((i) => Math.min(1, i + 1));
      else if (key.leftArrow) {
        if (settingsIndex === 0) changeLang(-1);
        else changeProtocol(-1);
      } else if (key.rightArrow) {
        if (settingsIndex === 0) changeLang(1);
        else changeProtocol(1);
      } else if (key.escape) setView(prevView);
      return;
    }

    // Tab：任意视图打开设置
    if (key.tab) {
      setPrevView(view);
      setSettingsIndex(0);
      setView('settings');
      return;
    }

    if (view === 'detail') {
      if (key.return || key.escape) setView('list'); // 回到列表
      else if (key.leftArrow || key.rightArrow) {
        setDetailTab((t) => (t === 'overview' ? 'credits' : 'overview'));
        setCreditsScroll(0);
      } else if (detailTab === 'credits' && key.upArrow) {
        setCreditsScroll((s) => Math.max(0, s - 1));
      } else if (detailTab === 'credits' && key.downArrow && detail) {
        const max = maxCreditsScroll(detail, rows);
        setCreditsScroll((s) => Math.min(s + 1, max));
      }
      return;
    }

    if (view === 'list') {
      if (key.upArrow) setSelected((s) => Math.max(0, s - 1));
      else if (key.downArrow) setSelected((s) => Math.min(items.length - 1, s + 1));
      else if (key.return) {
        const r = items[selected];
        if (r) void openDetail(r.id, lang);
      } else if (key.escape) setView('home');
      return;
    }

    // home：打字 + 榜单快捷键
    if (key.return) {
      void search(query, lang);
      return;
    }
    if (key.backspace || key.delete) {
      setQuery((q) => q.slice(0, -1));
      return;
    }
    if (!query && input.length === 1 && input >= '1' && input <= '4') {
      void loadBoard(BOARDS[Number(input) - 1].key, lang);
      return;
    }
    if (input && !key.ctrl && !key.meta) {
      setQuery((q) => q + input);
    }
  });

  return (
    <InkPictureProvider>
      <Box width="100%" flexDirection="column" alignItems="center" paddingY={1}>
        <Banner />
        <Box
          flexDirection="column"
          paddingX={2}
          width="100%"
          maxWidth={100}
          borderStyle="round"
          borderColor="gray"
        >
          <HUD lang={lang} posterProtocol={posterProtocol} />

          {view === 'settings' ? (
            <Settings settingsIndex={settingsIndex} lang={lang} posterProtocol={posterProtocol} />
          ) : view === 'detail' && detail ? (
            <MovieDetail
              detail={detail}
              posterProtocol={posterProtocol}
              tab={detailTab}
              scroll={creditsScroll}
            />
          ) : view === 'list' ? (
            <MovieList title={listTitle} items={items} selected={selected} busy={busy} />
          ) : (
            <Home query={query} />
          )}

          {busy && <Text dimColor>加载中…</Text>}
          {error && !busy && <Text color="red">✗ {error}</Text>}
        </Box>
      </Box>
    </InkPictureProvider>
  );
}

export default App;
