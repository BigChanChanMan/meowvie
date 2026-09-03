# meowvie

ink TUI 练手项目。技术栈：TypeScript + React(JSX) + ink。

## 运行

```bash
npm install
npm run dev   # 热重载; 或 npm start
```

TMDB 需要 token：把 `.env` 里的 `TMDB_ACCESS_TOKEN` 填上（https://www.themoviedb.org/settings/api → API Read Access Token）。`.env` 已加入 `.gitignore`，不会提交。

## 用法

启动后：输入电影名 → Enter 搜索 → ↑↓ 选择 → Enter 看详情 → Esc 返回。

## 已接入的库

- **ink** — TUI 框架，`render` / `Box` / `Text` / `useInput`
- **ink-picture** — 终端内嵌图片，`<InkPictureProvider>` + `<Image>`（需 iTerm2 / 支持 sixel 的终端，Windows 终端下显示 alt 文字）
- **@lorenzopant/tmdb** — TMDB API 客户端，`new TMDB(token)` + `tmdb.search.movies()` / `tmdb.movies.details()`
- **figlet** — 大字 banner（`ANSI Shadow` 字体）

> 注：ink 7 移除了 `TextInput` 组件，输入框是用 `useInput` 手写的（见 `src/App.tsx`）。