---
name: step-5-director-prompts
description: Step 5 of the AI filmmaking pipeline. Convert the approved storyboard, prompt package, and execution plan into direct copy-paste generation prompts for image and short-video tools such as Nano Banana, Midjourney, Flux, SDXL, Kling, or Runway. Use this when the user wants prompts that can be used immediately rather than higher-level planning language.
---

# Step 5 - Direct Generation Prompts

Use this skill after `step-4-shot-executor`.

This skill's job is to turn the approved planning stack into a final prompt delivery pack that a creator can paste directly into generation tools with minimal cleanup.

Pipeline position:

- `Step 1`: define the directing brief
- `Step 2`: expand into storyboard / shot script
- `Step 3`: convert shots into prompt packages
- `Step 4`: turn prompt packages into executable production tasks
- `Step 5`: output direct copy-paste prompts for generation tools

## What This Skill Does

Produce a tool-ready prompt package with:

- one primary English Step 5 file for direct model input
- one companion Chinese Step 5 file for human review and Chinese-input testing
- target tool mode and usage assumptions
- global generation rules
- prompt guardrails for single-frame generation
- per-shot English copy-paste prompts
- per-shot English motion prompts when motion tools are relevant
- per-shot short negative constraints
- per-shot Chinese translation for human review
- per-shot Chinese experimental prompt version
- prompt notes for still-first vs direct-video shots
- special anti-layout rules for tools that may otherwise generate contact sheets, pitch boards, or storyboard pages

The primary English file should be English-only in prompt content.
Do not place final Chinese titles, labels, CTA copy, or readable Chinese UI text inside the English execution prompts.

## What This Skill Does Not Do

Do not directly:

- claim that assets were generated
- write execution schedules again
- replace the storyboard
- replace the execution plan
- repeat Step 3 strategy analysis at full length
- stuff multiple shots into one mega-prompt unless the user explicitly wants a board or sheet
- mix the English execution prompts and the Chinese review copy into one default paste block

## Required Input

Prefer this stack as input:

- `02_step2_storyboard.md`
- `03_step3_prompt_package.md`
- `04_step4_execution_plan.md`

If Step 4 is present, treat it as the operational source of truth for:

- shot order
- shot naming
- workflow type
- direct-video vs still-first assumptions

If the user names a target tool, adapt prompt wording to that tool while preserving the film type guardrails.

If the user does not name a tool:

- default to single-frame keyframe prompts that are broadly compatible with modern image generators
- assume the user may paste prompts into tools like Nano Banana, Midjourney, Flux, or SDXL
- bias toward single-shot, single-frame clarity

## Main Goal

For every shot, output something the user can actually paste into a generator without the model hallucinating a storyboard page, contact sheet, or multi-panel layout.

Step 5 should make these things explicit:

- what the frame should contain
- whether it is a still or motion-first shot
- what visual details must stay
- what the tool must not do
- how to prevent board-style outputs
- which text is for model input vs which text is only for human reading

Step 5 is the final delivery layer:

- direct English image prompt for the model
- direct English motion prompt for the model when needed
- very short negative prompt
- one short tool note
- one separate Chinese translation file for the user
- one separate Chinese experimental version for testing

Step 5 should be materially shorter and more pasteable than Step 3.
If Step 5 starts reading like a second strategy brief, it is too long.

Default file split:

- primary English file: `05_step5_generation_prompts.md`
- companion Chinese file: `05_step5_generation_prompts_zh.md`

The English file is the canonical Step 5 deliverable.
The Chinese file is a companion aid and should not replace the English file as the default generation source.
If the storyboard includes Chinese copy, preserve that meaning in the Chinese companion file and convert the English primary file to placeholder wording for post compositing.

## Output Format

When writing files, produce two coordinated outputs.

### A. Primary English File

Write this to:

- `05_step5_generation_prompts.md`

This file is for direct model input.
Keep it compact, highly pasteable, and English-first.
Treat it as an English-only execution sheet.

### B. Companion Chinese File

Write this to:

- `05_step5_generation_prompts_zh.md`

This file is for human review plus optional Chinese-input testing.
It may be slightly more explanatory, but should still stay concise.

Across the two files, structure the content using these sections in order.

### 1. Generation Target

State:

- target tool or tool class
- whether the package is optimized for still frames, motion prompts, or both
- whether the prompts are copy-paste-ready

### 2. Global Prompt Guardrails

This section is mandatory.

Include:

- `Locked Style Rules`
- `Single-Frame Rules`
- `Do-Not-Generate Rules`
- `Text Handling Rules`

At minimum, explicitly prevent:

- storyboard sheets
- contact sheets
- pitch boards
- multi-panel layouts
- labels or shot-number overlays
- explanatory captions inside the image

Keep this section compact.
Prefer short operational bullets over long explanation paragraphs.

### 3. Tool-Specific Prompting Notes

Keep this practical and short.

If the tool is image-first:

- emphasize single-frame composition
- keep one clear subject and one clear visual action
- keep typography minimal unless the shot truly requires text

If the tool is motion-first:

- separate the keyframe prompt from the motion prompt
- keep the action short and explicit

Do not turn this section into a long tool manual.
Limit it to only the highest-value execution notes.

### 4. Per-Shot Direct Prompt Pack

For each shot, output a compact block with:

- `Shot ID`
- `Shot Use`
- `English Copy-Paste Prompt`
- `English Motion Prompt` when applicable
- `Negative Constraints`
- `Tool Note`

In the companion Chinese file, include:

- `中文释义`
- `中文实验版 Prompt`

Rules:

- `English Copy-Paste Prompt` must be the default version and ready to paste directly
- `English Motion Prompt` should also be directly pasteable when a video tool is relevant
- default to one shot per prompt
- when a shot is still-first, the prompt should describe a single composed frame
- when a shot is motion-first, include a short direct-video prompt after the still prompt when needed
- include anti-board language when it helps keep the tool on a single image
- if text matters in-frame, prefer wording such as `reserve empty text area for post compositing` instead of asking the model to render final Chinese typography
- keep the Step 5 delivery pack shorter and more directly usable than Step 3
- the English default prompt should avoid final Chinese title text by default unless the user explicitly prioritizes in-image Chinese rendering
- prefer placeholders such as `empty title area`, `headline added in post`, `UI text composited later`, or `no readable text`
- keep `Negative Constraints` short enough to paste quickly
- keep `Tool Note` to one sentence
- the English primary file should contain only English execution prompts plus short negatives and tool notes
- the Chinese file should not be required for normal English-first generation use
- the English primary file must not contain readable Chinese title text, Chinese CTA text, or Chinese UI labels
- if a shot needs Chinese copy, rewrite the English prompt using placeholders such as `empty Chinese headline area`, `Chinese title added in post`, `UI labels added later`, or `no readable text`

### 5. Batch Paste Plan

Group shots into practical batches such as:

- titles
- UI cards
- abstract graphics
- key hero visuals

State which shots are best to test first.

Keep batch guidance lightweight.
Do not repeat long execution reasoning already covered in Step 4.

### 6. Prompt Usage Notes

Include:

- what to paste as-is
- what can be shortened if the tool is too literal
- what shots need manual typography or compositing later
- when to try the Chinese experimental version first

Keep this section brief.
It should help the user paste faster, not restate upstream strategy.

### 7. Final Handoff

End with a short note covering:

- which 3 shots to test first
- which prompts are safest
- which prompts are fragile

## Prompt Writing Rules

1. Prefer one prompt per shot.
2. Start with composition and subject, not style spam.
3. Keep prompt text clean and copy-pasteable.
4. Make the English prompt the primary execution version.
5. Explicitly say `single frame only` when the target tool may build layouts.
6. Explicitly forbid `storyboard`, `contact sheet`, `multi-panel`, `sheet`, `pitch board`, and `labels` unless the user asked for them.
7. Keep text-generation expectations realistic; if typography matters, note that it may need compositing.
8. Preserve the normalized `video_type`.
9. Do not let tool phrasing turn an MG explainer into a pitch board or mood board.
10. Do not mix Chinese review text into the English execution file.
11. Always provide a Chinese companion file with a Chinese translation and a clearly labeled Chinese experimental version.
12. Avoid re-explaining execution mode, continuity logic, and risk analysis at Step 3 depth.
13. Make Step 5 feel like a final delivery pack, not a second strategy brief.
14. Default to English prompts that describe layout and composition without requiring final Chinese typography in-image.
15. If text is important, tell the model to leave a clean text area for post rather than rendering the final Chinese copy.
16. Keep negative prompts short, operational, and pasteable.
17. Treat the English file as the default generation source and the Chinese file as a companion, not a merged bilingual prompt sheet.
18. Do not include Han characters in the English execution prompts unless the user explicitly requests that the English file itself should test Chinese text rendering.

## Two-File Output Rules

Step 5 should support English execution plus Chinese review without lowering generation quality.

Use this split:

- `05_step5_generation_prompts.md` for English execution prompts
- `05_step5_generation_prompts_zh.md` for Chinese translation and Chinese experimental prompts

Execution guidance:

- the English version is the recommended default for image and video tools
- the Chinese file is for user understanding and optional Chinese-input testing
- never merge the Chinese translation into the same code block as the English prompt
- make it obvious that the English file is the one to paste by default

Recommended labels:

- `Primary English Step 5 - paste these prompts by default.`
- `Chinese Step 5 companion - for review only unless testing Chinese-input prompts.`
- `Chinese experimental version - use only for Chinese-input testing.`

When typography matters:

- prefer English prompt wording like `no readable text`, `reserve empty headline area`, or `typography added in post`
- avoid asking the model to render final Chinese UI text unless the user explicitly prioritizes in-image Chinese text over reliability
- when a Chinese title or UI label exists in the storyboard, move it into the Chinese companion file by default rather than embedding it in the English default prompt

## Final Validation Rules

Before finishing Step 5:

1. scan the primary English file for Chinese title text, Chinese CTA copy, and readable Chinese UI labels
2. if present, rewrite those prompts into placeholder-based English wording
3. keep the real Chinese copy only in the Chinese companion file unless the user explicitly asked for Chinese text rendering tests in the primary file
4. ensure the English file reads like a clean execution sheet rather than a bilingual reference document

## Good Output Standard

A strong Step 5 result should let the user:

- copy one English shot prompt at a time into a tool
- copy one English motion prompt at a time into a motion tool when needed
- get a single frame rather than a storyboard page
- understand the Chinese meaning without contaminating the English default input
- test a Chinese-native prompt path from a separate companion file without confusing it with the recommended default
- understand which prompts need manual polish
- test the right hero shots first
- feel clearly more final, shorter, and more paste-ready than Step 3
