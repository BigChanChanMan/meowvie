# meowvie

基于 TMDB 的终端电影浏览器，两种用法：交互式 **TUI** 和可脚本化的 **CLI**。
技术栈：TypeScript + React(JSX) + Ink + commander。

## 安装

```bash
npm install
```

TMDB 需要 token：把 `.env` 里的 `TMDB_ACCESS_TOKEN` 填上
（https://www.themoviedb.org/settings/api → API Read Access Token）。
`.env` 已加入 `.gitignore`，不会提交。

## TUI

```bash
npm run dev     # 热重载
npm start       # 无参数即进 TUI
```

| 视图 | 按键 |
|---|---|
| 首页 | 输入 → Enter 搜索；空输入时数字 1-4 打开榜单 |
| 列表 | ↑↓ 选择；Enter 看详情；Esc 返回首页 |
| 详情 | ←→ 切换「简介 / 演职员表」；演职员表内 ↑↓ 滚动；Esc/Enter 返回列表 |
| 设置 | Tab 打开；↑↓ 选行；←→ 切语言/海报协议；Esc 返回 |
| 任意 | Ctrl+C 退出 |

## CLI

同一个二进制：带子命令进 CLI、无参数进 TUI。输出原始 TMDB JSON，适合脚本和智能体调用。

```bash
npm start -- search "盗梦空间"
npm start -- movie 27205 --pretty
npm start -- credits 27205
```

### 命令（对应 TMDB 端点）

| 命令 | TMDB 端点 | 说明 |
|---|---|---|
| `search <query>` | `/search/movie` | 搜索电影 |
| `popular` | `/movie/popular` | 热门 |
| `top-rated` | `/movie/top_rated` | 高分 |
| `now-playing` | `/movie/now_playing` | 正在上映 |
| `upcoming` | `/movie/upcoming` | 即将上映 |
| `movie <id>` | `/movie/{id}` | 详情（内嵌 credits） |
| `credits <id>` | `/movie/{id}/credits` | 演职员（全量 cast + crew） |

### flag（镜像 TMDB query 参数）

- `--language <code>` — 语言（默认 `zh-CN`）
- `--page <n>` — 页码
- `--region <code>` — 地区（ISO 3166-1）
- `--pretty` — 美化 JSON 缩进（非 TMDB 参数）

### 输出与退出码

- **stdout**：原始 TMDB JSON
- **stderr**：错误信息
- 退出码：`0` 成功（含空结果）、`1` 运行错误（网络/API）、`2` 用法错误（坏命令/坏参数）

## 开发

```bash
npm run typecheck   # 类型检查
npm run check       # 纯函数 seam 断言（credits + cli，注入 fake core）
```

## 已接入的库

- **ink** — TUI 框架（`render` / `Box` / `Text` / `useInput` / `useWindowSize`）
- **ink-picture** — 终端内嵌图片（需 iTerm2 / 支持 sixel 的终端，否则显示 alt 文字）
- **@lorenzopant/tmdb** — TMDB 类型安全 API 客户端
- **commander** — CLI 子命令解析
- **figlet** — 大字 banner（`ANSI Shadow` 字体）