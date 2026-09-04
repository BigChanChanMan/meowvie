# 领域文档

工程技能在探索代码库时，应如何消费本仓库的领域文档。

## 探索前，先读这些

- 仓库根目录的 **`CONTEXT.md`**，或
- 若根目录存在 **`CONTEXT-MAP.md`**：它指向每个上下文的一份 `CONTEXT.md`，读取与主题相关的每一份。
- **`docs/adr/`**：读取与你即将动手修改区域相关的 ADR。多上下文仓库中，还应查看 `src/<context>/docs/adr/` 下的上下文级决策。

如果上述任何文件不存在，**静默继续**。不要标注其缺失，也不要建议提前创建。`/domain-modeling` 技能（经由 `/grill-with-docs` 与 `/improve-codebase-architecture` 触发）会在术语或决策真正敲定时惰性地创建它们。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 系统级决策
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← 上下文级决策
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 使用术语表的词汇

当你的输出命名了一个领域概念（出现在 issue 标题、重构提案、假设、测试名中）时，使用 `CONTEXT.md` 中定义的术语。不要漂移到术语表明确避用的同义词上。

如果你需要的概念还没进术语表，那是一个信号：要么你正在自造项目并不使用的语言（重新考虑），要么确实存在缺口（记下来交给 `/domain-modeling`）。

## 标记 ADR 冲突

如果你的输出与现有 ADR 相抵触，明确指出来，而不是默默覆盖：

> 与 ADR-0007（事件溯源订单）相抵触，但值得重新审视，因为……