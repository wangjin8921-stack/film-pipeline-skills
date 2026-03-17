---
name: step-3-prompt-director
description: Step 3 of the AI filmmaking pipeline. Convert a Step 2 storyboard into generation-ready prompt packages for images and video. Use this when the user needs per-shot prompt strategy, consistency anchors, motion wording, negative constraints, and model-oriented execution guidance across product promos, enterprise films, opening videos, interviews, event videos, MG explainers, and other short-form formats.
---

# Step 3 - Prompt Director

Use this skill after `step-2-film-scriptboard`.

This skill's job is to convert storyboard shots into a **prompt design brief** without losing continuity, tone, or production logic.

Pipeline position:

- `Step 1`: define the directing brief
- `Step 2`: expand into storyboard / shot script
- `Step 3`: convert shots into prompts and generation tasks

## What This Skill Does

Produce a structured prompt design brief with:

- global visual anchor
- character and environment consistency anchors
- per-shot execution mode
- per-shot visual core
- per-shot motion direction
- negative prompt guidance
- continuity-critical guidance per shot
- risk notes per shot
- batching and naming guidance

## What This Skill Does Not Do

Do not directly:

- call APIs
- generate images
- generate video
- output the final copy-paste delivery pack
- render voiceover
- cut the edit

Those belong to later execution steps.

## Required Input

Prefer a `step-2-film-scriptboard` result as input.

If the user only provides Step 1 output, reconstruct the minimal shot logic first, then continue.

If the storyboard clearly reflects a stable `video_type`, use that type to choose the right prompt density and execution strategy.
For type-specific prompt behavior, read [references/prompt_type_profiles.md](references/prompt_type_profiles.md).
If Step 2 already includes a freshness plan, carry it into the prompts without breaking the type guardrails.
If a benchmark case is available, borrow only the reusable prompt logic.
Do not clone the benchmark's visual surface by default.

## Working Style

Think like a prompt supervisor for a commercial pipeline.

- preserve continuity first
- write prompts that are specific but not bloated
- prefer reusable visual anchors over reinventing each shot
- adapt prompt density to execution mode
- avoid model-hype wording and empty cinematic spam

## Main Goal

Turn each shot into something a downstream generation workflow can execute with minimal reinterpretation.

For every shot, Step 3 should answer:

- what must be visible
- what must remain consistent
- what movement direction must happen
- what the model should avoid
- whether the shot should start from still image or direct video

Step 3 is the strategy layer, not the final delivery layer.
It should define the prompt logic that Step 4 can execute and Step 5 can compress into final tool-ready prompts.

Also make sure the prompt package matches the format:

- an `Interview Film` should not get over-designed motion prompts
- an `MG Explainer` should lean into graphic-composite logic
- a `Warm-Up / Hype Video` should carry rhythm and impact, not long explanatory prompts

For long-form opening videos, Step 3 must preserve one brand DNA while still allowing multiple prompt families across sections.
Do not turn a 60-120 second opening into one repeated prompt logic with swapped nouns.

## Output Format

Always structure the response using these sections in order.

### 1. Global Visual Anchor

Define the universal look shared by all shots:

- protagonist identity
- wardrobe anchor
- environment anchor
- lighting anchor
- color anchor
- realism anchor
- camera language anchor

This section should be short and reusable.

### 2. Continuity Lock Pack

List the exact continuity items that must not drift:

- face / age / ethnicity presentation
- hairstyle
- wardrobe
- office layout
- device style
- UI style
- time-of-day state

### 3. Prompting Strategy

Explain how prompts will be handled across execution types:

- `ai-first-still-to-video`
- `ai-first-direct-video`
- `hybrid-reference`
- `graphic-composite`

Keep this practical and brief.

If the storyboard contains multiple sections or visual systems, say how many prompt families are needed and what each family controls.

### 4. Prompt Guardrails And Freshness Levers

This section is mandatory.

Include:

- `Locked Prompt Behavior`
- `Allowed Variation Zones`
- `Freshness Levers`
- `Drift Risks`

Use it to show how the prompt package will stay inside the chosen format while still feeling project-specific.

### 5. Per-Shot Prompt Package

For each shot, use a compact numbered block with these fields:

- `Shot ID`
- `Prompt Family`
- `Execution Mode`
- `Prompt Goal`
- `Visual Core`
- `Motion Direction`
- `Negative Constraints`
- `Continuity Anchors`
- `Risk Notes`
- `Fallback Plan`

Rules:

- `Visual Core` should establish the frame logic clearly without trying to be the final copy-paste prompt line
- `Motion Direction` should describe the intended movement from that frame without over-formatting it as a final tool command
- `Negative Constraints` should prevent the most likely visual failures
- `Risk Notes` should identify what is likely to drift, break, or become expensive
- `Fallback Plan` should state what to simplify if the model struggles

### 6. Batch Generation Plan

Group shots by generation logic:

- same environment batch
- same character batch
- same UI batch
- same motion type batch

This helps the later execution step save cost and preserve consistency.

### 7. Asset Naming Plan

Provide a deterministic file naming scheme such as:

- `s01_office_stress_keyframe.png`
- `s01_office_stress_motion.mp4`

### 8. Step 4 Handoff Notes

End with instructions for the execution step.

Include:

- which shots must be generated first
- which shots need strongest consistency control
- which shots can be retried cheaply
- which shots are likely expensive or fragile

## Prompt Writing Rules

When writing prompts:

1. Start with subject and environment, not style spam.
2. Keep the visual hierarchy clear.
3. Put continuity-critical details early.
4. Motion should be simple, legible, and filmable by current models.
5. Avoid overloaded prompts with too many simultaneous actions.
6. Negative constraints should be targeted, not generic laundry lists.
7. Match prompt density to the `video_type`.
8. Use freshness in metaphor, wording texture, graphic system, or framing logic, not by drifting into the wrong format.
9. Keep Step 3 at the strategy layer rather than the final delivery layer.
10. Leave final copy-paste prompt compression, bilingual delivery, and tool-paste formatting to Step 5 by default.
11. For long-form opening videos, group shots into distinct prompt families when the sections truly differ in visual system or content burden.

Examples:

- `Opening Video` and `Warm-Up / Hype Video`: fewer words, more impact and reveal control
- `Interview Film` and `Leadership Message Film`: simpler motion prompts, stronger framing and continuity locks
- `MG Explainer`, `Data Visualization Film`, `UI Demo / Screenflow Video`: more graphic-composite and layout clarity
- `Flash / Quick-Cut Montage`: shorter, punchier, easier-to-batch prompt units

## Execution-Type Rules

### ai-first-still-to-video

Use when:

- expression matters
- composition matters
- motion is simple

Approach:

- make the image prompt carry the composition
- make the video prompt carry subtle motion

### ai-first-direct-video

Use when:

- motion is the point
- screen transformations or fast visible actions matter

Approach:

- keep the action short and explicit
- avoid too many moving elements at once

### hybrid-reference

Use when:

- a UI or object needs control
- a reference plate or controlled still will help

Approach:

- define the reference need clearly
- keep variation low

### graphic-composite

Use when:

- logos
- UI overlays
- titles
- clean product plates

Approach:

- keep prompts minimal
- design for compositing clarity

## Long-Form Opening Guidance

If `video_type` is `Opening Video` and the storyboard spans `60` seconds or more:

- preserve a shared brand spine across the whole film
- but divide the prompt design into `3-5` distinct prompt families when the storyboard sections genuinely differ
- each prompt family should have its own visual logic, motion bias, and negative-risk profile
- reference elements such as `particles`, `big title`, or `logo reveal` may anchor one family without dominating all families
- if a family uses people, factory, product, device, UI, or global-system material, describe it as elevated, selective, and stage-ready rather than generic corporate-promo or documentary coverage
- keep wording biased toward ceremony, escalation, and reveal payoff so the prompts still read like an opening film
- if the film is intentionally minimalist and single-system, state that explicitly so Step 4 and Step 5 do not widen it by mistake

## AI-Filmmaking Constraints

Assume models may fail on:

- hand-device interaction precision
- dense UI readability
- subtle micro-expressions
- complex simultaneous object motion
- long continuous action

So write prompts that prefer:

- one clear subject
- one clear action
- one readable environment
- short motion arcs

## Output Quality Rules

- Do not rewrite the whole creative brief.
- Do not return vague cinematic adjectives without content.
- Do not produce one giant universal prompt for the whole film.
- Do produce shot-level strategy blocks that can be executed downstream immediately.
- Do make the prompt package feel tailored to this project, not copied from a default lane template.
- Keep formatting chat-safe: use numbered blocks, not oversized tables.
- Do maintain a meaningful gap between Step 3 strategy and Step 5 final prompt delivery.

## Supported Prompt Profiles

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
