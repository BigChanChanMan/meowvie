# meowvie

一个基于 TMDB 的终端电影浏览器（Ink + React TUI）。用户搜索电影、浏览榜单，查看电影详情与演职员表。

## 演职员

**演职员表（credits）**:
一部电影全部演出与幕后人员的统称，对应 TMDB 的 `credits`，包含 `cast`（演员）与 `crew`（职员）。
_Avoid_: 演员表、卡司表

**演员（Cast member）**:
在影片中出镜的表演者，对应 TMDB `cast` 条目。
_Avoid_: 卡司、出演者

**角色（Character）**:
演员在片中饰演的人物，对应 `cast` 条目的 `character` 字段。
_Avoid_: 剧中人

**职员（Crew member）**:
不参与表演的制作人员，对应 TMDB `crew` 条目。
_Avoid_: 幕后、制作人员

**导演（Director）**:
`job` 为 `Director` 的职员。
_Avoid_: 导演组

**编剧（Writer）**:
`department` 为 `Writing` 的职员。
_Avoid_: 剧本作者

**制片（Producer）**:
`job` 含 `Producer` 的职员（含执行制片等）。
_Avoid_: 制片人
