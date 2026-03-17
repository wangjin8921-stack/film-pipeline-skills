# Film Pipeline Skills

Film pipeline skills and plugin support for OpenClaw / Codex-style agent workflows.

## Overview

This repository packages a 5-step film generation workflow:

1. Step 1: Directing brief
2. Step 2: Scriptboard / storyboard planning
3. Step 3: Prompt design brief
4. Step 4: Shot execution plan
5. Step 5: Final prompt delivery pack

It also includes an optional plugin that helps `/film` run the full chain and resume from the next downstream step after manual edits.

## What Is Included

- `skills/film-pipeline`
  - Top-level orchestrator skill
- `skills/step-1-film-director`
  - Generates the directing brief
- `skills/step-2-film-scriptboard`
  - Generates the scriptboard / storyboard structure
- `skills/step-3-prompt-director`
  - Strategy layer for prompt design
- `skills/step-4-shot-executor`
  - Execution planning for shot production
- `skills/step-5-director-prompts`
  - Final delivery prompts for generation tools
- `plugins/subagent-shortcuts`
  - Optional plugin for `/film` orchestration and resume logic

## Workflow Design

- Step 3 is the strategy layer.
  - It defines execution mode, visual core, motion direction, continuity anchors, risks, and fallback plans.
- Step 5 is the final delivery layer.
  - It produces generation-ready prompt packs for operators and tools.
- Step 5 supports two outputs:
  - `05_step5_generation_prompts.md`
  - English-first execution prompts
  - `05_step5_generation_prompts_zh.md`
  - Chinese companion file for reading and Chinese experimental prompt testing

## Repository Structure

```text
skills/
  film-pipeline/
  step-1-film-director/
  step-2-film-scriptboard/
  step-3-prompt-director/
  step-4-shot-executor/
  step-5-director-prompts/
plugins/
  subagent-shortcuts/
```

## Installation

### Skills

Copy each folder under `skills/` into your Codex or OpenClaw skills directory.

### Plugin

Copy `plugins/subagent-shortcuts` into your OpenClaw plugins directory if you want `/film` orchestration and resume support.

## Recommended Use

- Use `film-pipeline` as the top-level entry.
- Use Step 3 for prompt strategy, not final copy-paste prompts.
- Use Step 5 for final prompt delivery, not for planning.
- Keep Chinese translation or experimental prompt content in the Chinese companion file when possible.

## Chinese Summary

这是一个给 OpenClaw / Codex 类代理使用的影视工作流技能仓库，包含完整的 `Step 1` 到 `Step 5` 流程，以及可选的 `/film` 插件。

核心分工如下：

- `Step 3` 是策略层
  - 定义执行方式、画面核心、运动方向、连续性、风险和降级方案
- `Step 5` 是最终投喂层
  - 产出可直接用于生成工具的最终 prompt
- `Step 5` 支持英文主文件和中文 companion 文件分离

## Versioning

This repository starts at `v0.1.0` as the first publishable baseline.
