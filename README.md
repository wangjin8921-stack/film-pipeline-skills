# Film Pipeline Skills

Film pipeline skills and prompt delivery workflow for OpenClaw.

This repository contains:

- `skills/film-pipeline`: top-level orchestrator skill
- `skills/step-1-film-director`: Step 1 directing brief
- `skills/step-2-film-scriptboard`: Step 2 storyboard/scriptboard
- `skills/step-3-prompt-director`: Step 3 prompt design brief
- `skills/step-4-shot-executor`: Step 4 execution plan
- `skills/step-5-director-prompts`: Step 5 final prompt delivery pack
- `plugins/subagent-shortcuts`: optional OpenClaw plugin for `/film` flow and resume logic

## Structure

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

## Notes

- Step 3 is the strategy layer (`prompt design brief`).
- Step 5 is the final delivery layer (`final prompt delivery pack`).
- Step 5 can produce an English primary output and a Chinese companion output.
- The plugin is optional, but it helps `/film` run Step 1 to Step 5 and resume from the next downstream step after manual edits.

## Suggested Install Paths

- Skills: copy each folder under your Codex/OpenClaw skills directory
- Plugin: copy `plugins/subagent-shortcuts` into your OpenClaw plugins directory

