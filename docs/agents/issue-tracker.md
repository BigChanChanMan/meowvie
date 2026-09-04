# Issue 追踪器：GitHub

本仓库的 issue 与 spec 以 GitHub issue 的形式托管。所有操作统一使用 `gh` CLI。

## 约定

- **创建 issue**：`gh issue create --title "..." --body "..."`。多行正文用 heredoc。
- **读取 issue**：`gh issue view <number> --comments`，用 `jq` 过滤评论，同时拉取标签。
- **列出 issue**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，并配合相应的 `--label` 与 `--state` 过滤条件。
- **评论 issue**：`gh issue comment <number> --body "..."`
- **添加 / 移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：`gh issue close <number> --comment "..."`

仓库名从 `git remote -v` 推断；在 clone 目录内运行时，`gh` 会自动识别。

## 将 PR 作为分诊（triage）入口

**PR 作为请求入口：否。**（若本仓库将外部 PR 视为功能请求，请改为 `yes`；`/triage` 会读取此标志。）

设为 `yes` 后，PR 与 issue 使用相同的标签与状态流转，改用对应的 `gh pr` 命令：

- **读取 PR**：`gh pr view <number> --comments`，用 `gh pr diff <number>` 查看 diff。
- **列出待分诊的外部 PR**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的（剔除 `OWNER`/`MEMBER`/`COLLABORATOR`）。
- **评论 / 打标签 / 关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的 issue 与 PR 共用一个编号空间，裸编号 `#42` 可能指向两者：先用 `gh pr view 42` 解析，失败则回退到 `gh issue view 42`。

## 当技能说“发布到 issue 追踪器”时

创建一个 GitHub issue。

## 当技能说“获取相关工单”时

运行 `gh issue view <number> --comments`。

## 寻路（wayfinding）操作

供 `/wayfinder` 使用。**地图（map）** 是单个 issue，**子（child）** issue 作为工单。

- **地图**：一个带有 `wayfinder:map` 标签的 issue，承载 Notes / Decisions-so-far / Fog 正文。`gh issue create --label wayfinder:map`。
- **子工单**：以 GitHub 子 issue 形式关联到地图的 issue（通过子 issue 端点调用 `gh api`）。若未启用子 issue，则将子项加入地图正文的任务清单，并在子项正文顶部写 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。认领后，工单指派给负责的开发者。
- **阻塞（blocking）**：使用 GitHub 的**原生 issue 依赖**，即规范、UI 可见的表示。通过 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加依赖边，其中 `<blocker-db-id>` 是阻塞项的数字**数据库 id**（用 `gh api repos/<owner>/<repo>/issues/<n> --jq .id` 获取，_不是_ `#number` 或 `node_id`）。GitHub 通过 `issue_dependencies_summary.blocked_by` 暴露依赖（仅未关闭的阻塞项，即实时门禁）。依赖不可用时，回退为在子项正文顶部写一行 `Blocked by: #<n>, #<n>`。当所有阻塞项均关闭时，工单解除阻塞。
- **前沿查询**：列出地图的未关闭子项（`gh issue list --state open`，限定在地图的子 issue / 任务清单范围内），剔除仍有未关闭阻塞项的（`issue_dependencies_summary.blocked_by > 0`，或 `Blocked by` 行里有未关闭 issue 的）、以及已被指派的；按地图内的顺序取第一个。
- **认领**：`gh issue edit <n> --add-assignee @me`，即会话的第一次写入。
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再将上下文指针（gist + 链接）追加到地图的 Decisions-so-far。