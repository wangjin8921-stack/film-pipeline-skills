---
name: step-4-shot-executor
description: Step 4 of the AI filmmaking pipeline. Convert Step 3 prompt packages into an execution-ready shot production plan. Use this when the user needs generation order, tool routing, per-shot task breakdown, batch strategy, output folders, retry policy, and practical production coordination across product promos, interview films, MG explainers, training demos, hype videos, leadership messages, and other short-form formats.
---

# Step 4 - Shot Executor

Use this skill after `step-3-prompt-director`.

This skill's job is to convert prompt packages into a real production plan that can actually be executed.

Pipeline position:

- `Step 1`: define the directing brief
- `Step 2`: expand into storyboard / shot script
- `Step 3`: convert shots into prompts and generation tasks
- `Step 4`: turn prompt packages into executable production tasks
- `Step 5`: turn the execution plan into direct copy-paste generation prompts

## What This Skill Does

Produce a production-ready execution package with:

- normalized execution profile by `video_type`
- generation order
- tool routing per shot
- still-first vs direct-video decisions
- batch execution groups
- folder and asset organization
- retry and fallback policy
- quality control checklist
- edit-handoff preparation

## What This Skill Does Not Do

Do not directly:

- claim that images or videos were generated if they were not
- fabricate API responses
- write final edit decisions as if they were already rendered
- skip tool assumptions
- pretend every format should use the same execution rhythm

If tools are not fixed yet, produce a tool-agnostic execution plan with clear placeholders.

## Required Input

Prefer a `step-3-prompt-director` output as input.

If the user only provides Step 2, derive the minimum prompt execution assumptions, then continue.

If the Step 3 package clearly reflects a stable `video_type`, use that type to decide:

- which assets must be approved first
- whether execution should lean toward `graphic-composite`, still-to-video, or direct-video
- how batches should be grouped
- which continuity locks matter most
- how folders should be split for real production use

For type-specific execution behavior, read [references/execution_type_profiles.md](references/execution_type_profiles.md).
If Step 3 already names freshness levers, preserve them in execution as controlled experiments rather than letting them rewrite the whole plan.
If a benchmark case is available, use it to calibrate execution order and asset logic only where those lessons are genuinely transferable.
Do not turn one benchmark's production shape into the universal batch diagram for that type.

## Working Style

Think like a production coordinator plus AI pipeline supervisor.

- optimize for reliability over novelty
- protect the execution logic implied by the format
- minimize wasted generations
- generate high-risk anchor shots first
- lock continuity before volume production
- separate cheap retries from expensive shots
- always think in batches, not isolated single shots

## Main Goal

Answer the production questions:

- which shots should be generated first
- which tool type should handle each shot
- what assets must exist before later shots can start
- which shots are fragile and need extra review
- how all generated assets should be stored and named
- how the plan should change for the actual film format

Examples:

- `Interview Film`: protect the interview master setup first, then expand into cutaways
- `MG Explainer / Information Short`: build design system and graphic modules before shot variations
- `Warm-Up / Hype Video`: prefer faster, cheaper, more repeatable batches
- `Training / Process Explainer Short`: lock UI state and step clarity before motion polish
- `Leadership Message Film`: keep execution restrained and credibility-first

## Supported Output Modes

This skill should work in either mode.

### Mode A - Tool-Agnostic Production Plan

Use when the user has not finalized generation tools.

Output execution logic using categories such as:

- still image generator
- direct video generator
- UI/composite tool
- upscale / cleanup tool

### Mode B - Tool-Specific Production Plan

Use when the user names specific tools such as:

- Midjourney
- Flux
- SDXL / ComfyUI
- Kling
- Runway
- Pika
- Hailuo
- Veo
- Luma

If specific tools are named, route shots accordingly.

## Output Format

Always structure the response using these sections in order.

### 1. Execution Overview

Summarize:

- normalized `video_type`
- target asset count
- execution philosophy
- critical dependency order
- why this execution shape fits the format

### 2. Tool Routing Strategy

Explain which kinds of shots go to which tool class or named tool.

At minimum, separate:

- character anchor shots
- office/environment anchor shots
- UI/composite shots
- motion-heavy shots
- final brand or message-critical shots

If the format is information-led, explicitly separate design-system work from shot rendering.
If the format is people-led, explicitly separate anchor continuity work from support coverage.

### 3. Execution Guardrails And Freshness Levers

This section is mandatory.

Include:

- `Locked Execution Priorities`
- `Allowed Experiment Zones`
- `Freshness Levers`
- `Drift Risks`

Use it to show where the project can still be inventive without turning the execution plan into the wrong production model.

### 4. Execution Order

List the recommended order of production.

Use a numbered phase structure such as:

- Phase 1: anchor stills or design-system setup
- Phase 2: continuity or layout validation
- Phase 3: motion generation
- Phase 4: overlays, composites, or support coverage
- Phase 5: pickup / retry pass

Not every project needs every phase. Adapt the phase logic to the `video_type`.

### 5. Shot Task List

This is the core section.

Use compact numbered shot blocks. For each shot include:

- `Shot ID`
- `Asset Goal`
- `Generate First`
- `Primary Tool Type`
- `Recommended Workflow`
- `Dependency`
- `Expected Output`
- `Retry Cost`
- `QC Focus`
- `Fallback Route`

Recommended workflow values:

- `still -> select -> animate`
- `direct video`
- `ui/composite build`
- `reference build -> animate`

Retry cost values:

- `low`
- `medium`
- `high`

### 6. Batch Plan

Group tasks into efficient batches.

Possible batch families:

- protagonist anchor batch
- environment anchor batch
- UI or design-system batch
- motion batch
- quote-support cutaway batch
- rhythm-hit batch
- brand/composite batch

For each batch state:

- why it is grouped together
- what continuity or layout it protects
- what should be approved before moving on
- whether it is cheap to retry or should be isolated

### 7. Folder Structure

Define a production folder scheme that fits the format.

Common base folders:

- `01_anchor_stills`
- `02_selects_and_locks`
- `03_motion_clips`
- `04_ui_or_graphics`
- `05_composites`
- `06_pickups`
- `07_edit_prep`

Adapt the middle folders to the format when needed.

Examples:

- `Interview Film`: separate `interview_master`, `support_cutaways`, and `quote_selects`
- `MG Explainer`: separate `design_system`, `cards`, `charts`, and `output_variants`
- `Warm-Up / Hype Video`: separate `rhythm_hits`, `text_hits`, and `hero_reveals`
- `Training / UI Demo`: separate `screen_states`, `annotations`, and `guided_outputs`

### 8. File Naming Rules

Provide deterministic naming patterns for:

- keyframes
- selects
- animated clips
- UI composites
- approved finals

Prefer names such as:

- `s01_anchor_office_v01.png`
- `s01_anchor_office_select_a.png`
- `s01_anchor_office_motion_v02.mp4`
- `ui_step02_card_v01.png`
- `final_s07_message_lock.mp4`

### 9. Quality Control Checklist

List what must be checked before approving a shot.

Common QC items:

- face consistency
- wardrobe consistency
- office or environment layout consistency
- UI clarity
- motion readability
- emotional clarity
- lighting consistency
- typography or label accuracy

Emphasize the QC items that matter most for the chosen `video_type`.

### 10. Retry And Recovery Policy

State:

- which shots to retry first
- which failures are acceptable
- when to downgrade complexity
- when to switch workflow type
- when to stop iterating and cover in edit instead

### 11. Step 5 Handoff Notes

End with explicit notes for the direct prompt-generation step.

Include:

- what files Step 5 needs
- which shots should become direct copy-paste prompts first
- which shots are safest for image-first tools
- which shots are fragile and need stronger negative constraints
- which assets are locked and should not be regenerated casually

## Execution Rules

1. Generate anchor identity shots before broad shot production.
2. Validate one approved protagonist or speaker look before generating all character shots.
3. Reuse environments aggressively.
4. Do not waste high-cost video generations before continuity or layout is proven.
5. UI, charts, logo shots, and typography shots should be controlled separately from cinematic shots.
6. Always isolate expensive shots from cheap shots in the plan.
7. Follow the normalized `video_type` from Step 1 and the prompt bias from Step 3.
8. If the format is information-led, build the design system first and variations second.
9. If the format is people-led, lock the main speaking setup first and treat support coverage as secondary.
10. If the format is hype-led, prefer smaller, faster, more disposable batches.
11. If the format is trust-led, keep the plan restrained and reduce flashy fragmentation.
12. Isolate creative experiments in contained batches so they can add freshness without destabilizing the core production plan.

## AI Production Constraints

Assume these are fragile:

- face continuity across many shots
- hand-device interaction
- dense readable UI
- exact screen text
- subtle emotional transitions
- long or complex motion
- typography consistency across many variants

So prefer execution patterns like:

- generate still anchor -> approve -> animate
- create UI as separate composite
- build chart or card systems before rendering many variations
- use direct video only where motion itself is the selling point
- isolate risky hero shots from fast-repeat utility shots

## Output Quality Rules

- Do not rewrite Step 1 or Step 2.
- Do not restate every prompt in full unless needed.
- Do produce a plan a producer could actually execute.
- Do keep the format chat-safe and practical.
- Do make placeholders explicit when tools are unknown.
- Do make the execution pattern feel correct for the film type, not just generally plausible.
- Do keep the plan flexible enough for creative variation without turning every project into the same batch diagram.

## Supported Execution Profiles

Commonly supported types include:

- product promo short
- enterprise promo
- brand image film
- internal promo / internal adoption short
- opening video
- warm-up / hype video
- event teaser
- event recap
- same-day edit / flash recap
- MC / guest intro video
- program interstitial / segment bumper
- interview film
- customer testimonial
- case story short
- street interview / vox pop
- training / process explainer short
- policy / compliance communication
- recruitment promo
- leadership message film
- MG explainer / information short
- data visualization film
- UI demo / screenflow video
- flash / quick-cut montage
- concept narrative short
- emotional atmosphere short
- trailer / teaser style short
- documentary-style enterprise film
