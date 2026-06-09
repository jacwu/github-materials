# 在 GitHub Copilot 中使用 Caveman

## Caveman 是什么

Caveman 项目 [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman)，是一个 AI 编码助手的通讯压缩插件。它让 AI agent 以"穴居人"风格回复——**砍掉约 75% 的输出 token**，同时保持完整的技术准确性。核心理念：能少说就少说。

## 工作原理

1. **运行时**：通过调用Caveman skill 告诉 agent 遵守压缩规则——去掉冗余词（a/an/the、filler 词、客套话），保留技术术语和代码不变，用碎片式短句代替完整段落。
2. **效果**：agent 的回复从冗长的段落变成简洁的要点，代码和技术名词保持原样。

## 使用对比

| 普通回复 (69 tokens) | Caveman 回复 (19 tokens) |
| --- | --- |
| "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time..." | "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`." |

**同样的修复方案，75% 更少的废话。**

> 注意：Caveman 只影响输出 token。思考/推理 token 不受影响。

---

## 安装和使用

Caveman 可以通过 plugin进行安装。

### 安装命令

登陆GitHub Copilot CLI后，运行以下命令安装 caveman 插件：

```bash
/plugin marketplace add JuliusBrussee/caveman
/plugin install caveman@caveman
```

### 使用Caveman

在VSCode或Copilot CLI中：

- 输入 `/caveman` 或说 "talk like caveman"
- 停用：说 "stop caveman" 或 "normal mode"

---

## 支持的 Mode（强度级别）

Caveman 支持 6 个强度级别，通过 `/caveman <level>` 切换：

| Level | 效果 | 示例回答 "Why React component re-render?" |
| --- | --- | --- |
| **lite** | 去掉 filler/hedging，保留完整句子和冠词 | "Your component re-renders because you create a new object reference each render. Wrap it in `useMemo`." |
| **full** (默认) | 去掉冠词，碎片句 OK，短同义词 | "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`." |
| **ultra** | 缩写常见词(DB/auth/config/fn/impl)，箭头表因果 | "Inline obj prop → new ref → re-render. `useMemo`." |
| **wenyan-lite** | 半文言文，去 filler 保文法 | "組件頻重繪，以每繪新生對象參照故。以 useMemo 包之。" |
| **wenyan-full** | 完全文言文，80-90% 字符压缩 | "物出新參照，致重繪。useMemo Wrap之。" |
| **wenyan-ultra** | 极致文言压缩 | "新參照→重繪。useMemo Wrap。" |

### 切换方式

```text
/caveman lite     ← 切换到 lite
/caveman ultra    ← 切换到 ultra
/caveman wenyan   ← 切换到 wenyan-full
/caveman          ← 恢复默认 (full)
```

---

## Caveman Skills

### `/caveman [lite|full|ultra|wenyan]`

压缩 agent 的每条回复。选择不同强度级别。默认 `full`，会话内持续生效。

### `/caveman-commit`

生成精简的 Conventional Commits 格式提交信息

### `/caveman-review`

精简的代码审查格式

### `/caveman-compress <filepath>`

将记忆文件（如 `CLAUDE.md`、项目笔记）重写为 caveman 风格，平均**减少 ~46% input tokens**。每次会话启动时上下文更小。

## 将 Caveman 注入每个 Session

默认情况下，需要在对话中显式触发（例如输入 `/caveman`）来启用压缩。如果希望“每条回复都默认生效”，可以通过Hooks在会话启动时自动注入 caveman 规则，不再需要每次手动触发。

1. 在用户主目录下创建 Hooks 目录。文档中统一使用通用路径 `~/.copilot/hooks/`。
2. 将 [session-start.json](./session-start.json) 和 [caveman-activate.js](./caveman-activate.js) 复制到 `~/.copilot/hooks/`。
3. 重启 Copilot CLI 使 `SessionStart` Hook 生效。

复制完成后，目录结构应类似于：

```text
~/.copilot/hooks/
  session-start.json
  caveman-activate.js
```
