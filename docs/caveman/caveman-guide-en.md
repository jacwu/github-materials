# Using Caveman in GitHub Copilot

## What is Caveman

The [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman) project is a communication-compression plugin for AI coding assistants. It makes the AI agent reply in a "caveman" style — **cutting output tokens by roughly 75%** while preserving full technical accuracy. Core idea: say less whenever you can.

## How It Works

1. **Runtime**: Invoking the Caveman skill tells the agent to follow compression rules — strip filler words (a/an/the, hedges, pleasantries), keep technical terms and code unchanged, and replace full paragraphs with short fragments.
2. **Effect**: The agent's replies turn from long prose into concise bullet points, while code and technical names stay intact.

## Comparison

| Normal reply (69 tokens) | Caveman reply (19 tokens) |
| --- | --- |
| "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time..." | "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`." |

**Same fix, 75% less noise.**

> Note: Caveman only affects output tokens. Thinking/reasoning tokens are not affected.

---

## Install and Use

Caveman is installed as a plugin.

### Install Commands

After signing in to GitHub Copilot CLI, run:

```bash
/plugin marketplace add JuliusBrussee/caveman
/plugin install caveman@caveman
```

### Using Caveman

In VS Code or Copilot CLI:

- Type `/caveman` or say "talk like caveman"
- To disable: say "stop caveman" or "normal mode"

---

## Supported Modes (Compression Levels)

Caveman supports 6 intensity levels, switched via `/caveman <level>`:

| Level | Effect | Example answer to "Why React component re-render?" |
| --- | --- | --- |
| **lite** | Strip filler/hedging, keep full sentences and articles | "Your component re-renders because you create a new object reference each render. Wrap it in `useMemo`." |
| **full** (default) | Drop articles, fragments OK, short synonyms | "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`." |
| **ultra** | Abbreviate common words (DB/auth/config/fn/impl), arrows for causality | "Inline obj prop → new ref → re-render. `useMemo`." |
| **wenyan-lite** | Semi-classical Chinese, strip filler, keep grammar | "組件頻重繪，以每繪新生對象參照故。以 useMemo 包之。" |
| **wenyan-full** | Full classical Chinese, 80-90% character compression | "物出新參照，致重繪。useMemo Wrap之。" |
| **wenyan-ultra** | Extreme classical compression | "新參照→重繪。useMemo Wrap。" |

### How to Switch

```text
/caveman lite     ← switch to lite
/caveman ultra    ← switch to ultra
/caveman wenyan   ← switch to wenyan-full
/caveman          ← back to default (full)
```

---

## Caveman Skills

### `/caveman [lite|full|ultra|wenyan]`

Compresses every agent reply. Pick an intensity. Defaults to `full` and stays active for the session.

### `/caveman-commit`

Generates concise Conventional Commits messages.

### `/caveman-review`

Concise code-review format.

### `/caveman-compress <filepath>`

Rewrites memory files (e.g. `CLAUDE.md`, project notes) into caveman style, reducing input tokens by **~46% on average**. Smaller context on every session start.

## Inject Caveman into Every Session

By default you must trigger compression explicitly per conversation (e.g. type `/caveman`). If you want "every reply compressed by default", use a Hook to auto-inject the caveman rules at session start, no more manual triggering.

1. Create a Hooks directory under your home folder. This doc uses the common path `~/.copilot/hooks/`.
2. Copy [session-start.json](./session-start.json) and [caveman-activate.js](./caveman-activate.js) into `~/.copilot/hooks/`.
3. Restart Copilot CLI so the `SessionStart` Hook takes effect.

After copying, the directory should look like:

```text
~/.copilot/hooks/
  session-start.json
  caveman-activate.js
```
