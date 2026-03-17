---
name: step-2-film-scriptboard
description: Step 2 of the AI filmmaking pipeline. Expand a Step 1 directing brief into a production-ready storyboard and shot script for AI video workflows. Use this when the user needs shot-by-shot structure, timing, visual continuity rules, on-screen action, optional voiceover or subtitle planning, and a clean handoff to prompt generation across product promos, enterprise films, opening videos, MG explainers, interviews, event videos, and other short-form formats.
---

# Step 2 - Film Scriptboard

Use this skill after `step-1-film-director`.

This skill's job is to convert the directing brief into a **shot-by-shot execution document** that downstream prompt and generation skills can use immediately.

Pipeline position:

- `Step 1`: define the directing brief
- `Step 2`: expand into storyboard / shot script
- `Step 3`: convert shots into prompts and generation tasks

## What This Skill Does

Produce a structured storyboard package with:

- shot-by-shot breakdown
- timing allocation
- continuity-safe scene logic
- visual action per shot
- performance direction
- transition logic
- optional narration/subtitle guidance
- clean handoff for prompt generation

## What This Skill Does Not Do

Do not directly output:

- final image prompts
- final video prompts
- API-ready JSON payloads
- editing XML or NLE timelines
- sound design cue sheets with frame precision

Those belong to later steps.

## Required Input

Prefer a `step-1-film-director` output as input.

If the user provides only a loose idea, first reconstruct the missing Step 1 assumptions briefly, then continue.

If the Step 1 brief already implies a stable `video_type`, use that type to shape the storyboard pattern.
For type-specific scene planning, read [references/storyboard_type_profiles.md](references/storyboard_type_profiles.md).
If Step 1 already includes a `Type Guardrails And Freshness Plan`, carry it forward explicitly.
If the user also provides a benchmark case, reuse only the structural lesson that transfers cleanly to the chosen type.
Do not inherit the benchmark's exact scene order unless the user explicitly wants that.

## Working Style

Be concrete and production-minded.

- Treat this as a storyboard supervisor + commercial director pass.
- Resolve ambiguity instead of passing it downstream.
- Prefer a smaller number of strong, feasible shots.
- Preserve the Step 1 creative spine.
- Optimize for AI generation consistency.

## Main Goal

Turn a directing brief into a document that answers:

- what each shot shows
- why the shot exists
- how long it lasts
- how it connects to nearby shots
- what must stay visually consistent
- what Step 3 will need to prompt

Also make the storyboard feel structurally correct for the chosen `video_type`.
An opening video should not read like a training film, and a training film should not read like a teaser.

## Output Format

Always structure the response using these sections in order.

### 1. Step 1 Lock Summary

Briefly restate the non-negotiable items from Step 1:

- normalized video type
- core concept
- audience
- style
- protagonist
- timeline
- visual constraints

### 2. Story Structure Map

Break the film into 3-5 sections with:

- section name
- target time range
- dramatic purpose
- visual objective

### 3. Type Drift Check And Freshness Plan

This section is mandatory.

Include:

- `Locked Format Signals`
- `Freshness Opportunities`
- `What This Storyboard Must Not Drift Into`

Use it to confirm that the storyboard still reads like the chosen type while leaving room for a distinctive treatment.

### 4. Shot List

This is the core output.

Prefer **numbered shot blocks** instead of wide tables when output may be shown in chat.
Default to numbered shot blocks for Telegram or other chat-first delivery surfaces.

For every shot, include:

- `Shot ID`
- `Duration`
- `Purpose`
- `Subject`
- `Location`
- `Visual Description`
- `Key Action`
- `Framing`
- `Camera Motion`
- `Transition In / Out`
- `Continuity Dependency`
- `Execution Mode`

Also include:

- `Time-of-Day State`

Execution mode must use one of:

- `ai-first-still-to-video`
- `ai-first-direct-video`
- `hybrid-reference`
- `graphic-composite`

### 5. Performance And Emotion Notes

For shots with people, define:

- facial expression
- body language
- emotional state
- intensity level

### 6. Continuity Control

List the exact continuity anchors Step 3 must preserve:

- face / age / gender presentation
- wardrobe
- props
- environment layout
- light direction
- time-of-day state
- UI state

### 7. Narration / Subtitle Option

If the concept benefits from text or voice, provide one of:

- no narration recommended
- short narration plan
- subtitle-only plan

Keep it concise and generation-friendly.

### 8. Prompting Handoff Notes

Do not write the final prompts.

Instead define:

- what visual tokens Step 3 must preserve
- which shots need the strongest reference consistency
- which shots are motion-first
- which shots can be solved with a keyframe plus motion

### 9. Production Risks

Identify the weak points in the storyboard:

- continuity risk
- over-complex movement
- too many environments
- unclear product interaction
- weak closing shot

State how to simplify them.

## Shot Writing Rules

When writing shots:

1. One shot = one visual purpose.
2. Avoid combining too many actions in a single shot.
3. If a shot needs exact hand/device interaction, simplify the action.
4. Reuse environments when possible.
5. Keep character continuity easy to maintain.
6. Product or UI interaction must be visually understandable within one viewing.
7. Do not let the timeline drift. Reuse the Step 1 time arc exactly unless the user explicitly changes it.
8. Keep total shot count aligned with Step 1. Do not exceed the Step 1 recommendation unless you explicitly justify why.
9. Match the shot pattern to the normalized `video_type` from Step 1.
10. Use freshness in motif choice, section framing, recurring inserts, or transition logic, not by breaking the type structure.

Examples:

- `Opening Video`: fewer message blocks, more impact shots, stronger reveal timing
- `Interview Film`: fewer camera ideas, stronger quote logic, more cutaway discipline
- `MG Explainer`: more information hierarchy, less physical acting
- `Flash / Quick-Cut Montage`: shorter beats, simpler per-shot reading

## AI-Filmmaking Rules

Assume downstream models perform best when:

- each shot has one clear subject
- environment changes are limited
- wardrobe is stable
- UI is simple
- action reads immediately
- emotional performance is not overly subtle

Prefer:

- 6-12 shots for short-form ads
- 1 main character
- 1 main office environment
- 1 clean visual transformation motif

## Timeline And Count Discipline

These are mandatory:

- preserve the Step 1 time progression as a single coherent arc
- do not mix incompatible states such as `late night` and `midday` unless Step 1 explicitly calls for that arc
- if Step 1 recommends `8-10` shots, stay within that range by default
- if an extra shot is essential, clearly say why the count increased

Default count bias by type:

- `Opening Video`, `Warm-Up / Hype Video`, `Flash / Quick-Cut Montage`: often shorter, denser shots
- `Interview Film`, `Leadership Message Film`, `Customer Testimonial`: fewer, longer, more quote-supporting shots
- `MG Explainer`, `Training / Process Explainer Short`, `UI Demo / Screenflow Video`: moderate count with strong step logic

## Output Quality Rules

- Do not drift back into Step 1 abstract strategy.
- Do not jump ahead to final prompting language.
- Do create a document that Step 3 can translate almost mechanically.
- Do make the storyboard feel specific, not like the default camera grammar for every format.
- If chat delivery would break a table, switch to compact numbered blocks.
- Keep each shot block self-contained so chat chunking does not destroy meaning.

## Supported Storyboard Profiles

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
