---
name: step-5-director-prompts
description: Step 5 of the AI filmmaking pipeline. Convert the approved storyboard, prompt package, and execution plan into two direct copy-paste prompt sheets: one English execution file and one Chinese companion file. Use this when the user wants the shortest possible per-shot final execution format with image prompt, animation prompt, and negative prompt.
---

# Step 5 - Direct Generation Prompts

Use this skill after `step-4-shot-executor`.

This skill is the last mile.
Turn the approved planning stack into prompt sheets the user can paste immediately.
Do not turn Step 5 into another brief, plan, or explanation document.

Pipeline position:

- `Step 1`: define the directing brief
- `Step 2`: expand into storyboard / shot script
- `Step 3`: convert shots into prompt strategy
- `Step 4`: build the executable shot production plan
- `Step 5`: output direct copy-paste prompts per shot

## What This Skill Does

Produce two coordinated Step 5 files by default:

- `05_step5_generation_prompts.md` as the primary English execution sheet
- `05_step5_generation_prompts_zh.md` as the Chinese companion sheet

Each file should contain:

- one block per shot
- one direct image prompt per shot
- one direct animation prompt per shot
- one short negative prompt per shot

## What This Skill Does Not Do

Do not:

- rewrite Step 3 strategy in long form
- rewrite Step 4 as another execution plan
- add batch plans unless the user explicitly asks
- add long tool manuals
- add review commentary inside each shot block
- merge multiple shots into one mega-prompt by default

If the output reads like a mini brief, it is too long.

## Required Input

Prefer this stack as input:

- `02_step2_storyboard.md`
- `03_step3_prompt_package.md`
- `04_step4_execution_plan.md`

Treat `04_step4_execution_plan.md` as the operational source of truth for:

- shot order
- shot naming
- still-first vs direct-video assumptions
- tool assumptions that materially affect prompt wording

If the user names a target tool, adapt prompt wording to that tool.
If the user does not name a tool, default to broadly compatible prompts for modern image and short-video tools.

## Default Output

Write two files by default:

- `05_step5_generation_prompts.md`
- `05_step5_generation_prompts_zh.md`

Keep both files short, paste-ready, and aligned shot by shot.

### English File

For each shot, output exactly:

```md
## Shot 1
Image:
<paste-ready image prompt>

Animation:
<paste-ready animation prompt>

Negative:
<short negative prompt>
```

### Chinese File

For each shot, output exactly:

```md
## Shot 1
<Chinese Image label>
<Chinese image prompt>

<Chinese Animation label>
<Chinese animation prompt>

<Chinese Negative label>
<short Chinese negative prompt>
```

Use these exact Simplified Chinese labels:

- Image label: Unicode sequence `U+56FE U+7247 U+FF1A`
- Animation label: Unicode sequence `U+52A8 U+753B U+FF1A`
- Negative label: Unicode sequence `U+8D1F U+9762 U+8BCD U+FF1A`

## Per-Shot Rules

- one shot per block
- no tables
- no extra sub-sections
- no strategy commentary inside the shot block
- keep the English negative line and the Chinese negative line short and operational
- keep shot order identical between the two files
- keep the English file as the default generation source
- keep the Chinese file as the review companion and optional Chinese-input test version

If a shot does not need a separate animation prompt, write:

- English: `Animation: none, use the image prompt as the approved first frame for light motion.`
- Chinese: use the exact Chinese animation label, then a concise Simplified Chinese equivalent of `none, use the image prompt as the approved first frame for light motion.`

If a shot is direct-video-first and does not need a separate image prompt, write:

- English: `Image: none, use the animation prompt as the primary generation input.`
- Chinese: use the exact Chinese image label, then a concise Simplified Chinese equivalent of `none, use the animation prompt as the primary generation input.`

## Prompt Writing Rules

1. Keep prompts short enough to paste without cleanup.
2. Start with subject and composition, not style spam.
3. Preserve the shot intent from Step 2.
4. Preserve the continuity anchors from Step 3.
5. Preserve the workflow assumptions from Step 4.
6. Prefer one clear action per prompt.
7. Explicitly prevent `storyboard`, `contact sheet`, `multi-panel`, `pitch board`, and `labels` when needed.
8. If text matters, prefer placeholder wording such as `reserve empty headline area for post`.
9. Do not put Chinese review text inside the English prompt unless the user explicitly wants in-image Chinese text rendering.
10. Do not add translation notes, rationale, or usage commentary unless the user asks.

## Good Output Standard

A strong Step 5 result should let the user:

- copy one shot block at a time
- paste `Image` directly into an image tool
- paste `Animation` directly into a motion tool
- use `Negative` immediately
- review the matching Chinese version side by side when needed
- move shot by shot without additional cleanup
