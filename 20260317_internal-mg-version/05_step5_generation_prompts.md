Project: Internal MG Promo Version
Step: step-5
Status: draft
Edited: agent
Depends on: 04_step4_execution_plan.md
Next recommended action: test Shot 2, Shot 3, and Shot 6 first, then build motion from approved frames

# Step 5 - Generation Prompts

## Generation Target

- Target tool class: image-first generators for MG keyframes such as Nano Banana, Flux, Midjourney, or SDXL
- Output mode: still-first prompt pack for later compositing and motion design
- Copy-paste readiness: prompts below are ready to paste one shot at a time

## Global Prompt Guardrails

### Locked Style Rules

- clean enterprise motion-graphics frame
- flat or lightly dimensional graphic-composite look
- deep blue, teal, white, and dark gray palette
- rounded cards, tabs, chips, arrows, message bubbles, and checklist marks
- 16:9 composition with safe center for later 9:16 crop

### Single-Frame Rules

- single frame only
- one shot per prompt
- one clear message per frame
- clear central composition with readable negative space for later typography compositing

### Do-Not-Generate Rules

- no storyboard page
- no contact sheet
- no multi-panel layout
- no pitch board
- no shot labels
- no subtitles baked into the image
- no cinematic live-action office scene
- no AI character, no photoreal actor, no sci-fi glow world

### Text Handling Rules

- treat all Chinese headlines and labels as layout placeholders, not final rendered text
- reserve clean text zones for manual typography in Figma or After Effects
- if the model tries to render text, keep it minimal, abstract, and easy to replace

## Tool-Specific Prompting Notes

- For image tools, keep each prompt focused on one composed frame and explicitly say `single frame only`.
- For MG-heavy shots, ask for modular UI cards and icon-led layout rather than photographic realism.
- If a tool keeps generating boards or multiple scenes, shorten the prompt and repeat `single frame only, not storyboard, not contact sheet`.

## Per-Shot Direct Prompt Pack

### Shot 1

- Shot ID: 01
- Shot Use: opening pain-point frame
- Copy-Paste Prompt: single frame only, 16:9 enterprise motion graphics keyframe, a cluttered digital workspace overwhelmed by floating message bubbles, task tags, quick notes, and fragmented communication chips, elements stacking too fast and crowding the screen, visual tension but still clean design, deep blue teal white dark gray palette, rounded UI cards and connector lines, clear center-weighted composition, reserve headline area for later Chinese typography, graphic-composite style, crisp internal enablement design, not realistic office photography, not a storyboard, not a contact sheet, not multi-panel
- Negative Constraints: no human actor, no live-action desk photo, no multi-panel board, no comic layout, no baked subtitles, no dense unreadable tiny UI, no sci-fi hologram look
- Tool Note: keep the clutter modular so it can animate into Shot 2 by collapsing into one clean panel

### Shot 2

- Shot ID: 02
- Shot Use: solution reveal hero frame
- Copy-Paste Prompt: single frame only, 16:9 motion graphics hero frame, fragmented bubbles and tags collapsing into one clean central tool panel, strong before-to-order transition frozen at the resolved moment, one elegant unified dashboard card in the middle, supporting chips and tabs neatly aligned, enterprise blue teal white palette, rounded rectangles, crisp hierarchy, calm and trustworthy internal product visual, leave clean headline zone above or left of the main panel for later Chinese text, graphic-composite key visual, not storyboard, not contact sheet, not pitch board
- Negative Constraints: no photoreal app screenshot, no laptop mockup photo, no multiple scenes in one frame, no labels around the outside, no dramatic 3D perspective
- Tool Note: this is the safest first style frame to lock the visual system

### Shot 3

- Shot ID: 03
- Shot Use: three use-case card frame
- Copy-Paste Prompt: single frame only, 16:9 enterprise MG frame showing three clean feature cards sliding into view, each card distinct but from one design system, cards represent follow-up organization, visit summary, and material output, icon-led layout, moderate spacing, bold headline zone and smaller support text zones left blank for later compositing, deep blue teal white dark gray palette, rounded cards, soft shadows or flat depth, readable and efficient internal communication design, one unified scene only, not storyboard, not contact sheet
- Negative Constraints: no exact Chinese text rendering requirement, no tiny UI overload, no four or more cards, no mood board, no labels or shot numbers, no character illustration
- Tool Note: keep card surfaces simple so labels can be added cleanly in post

### Shot 4

- Shot ID: 04
- Shot Use: 3-step onboarding frame
- Copy-Paste Prompt: single frame only, 16:9 motion graphics explainer frame, a clear left-to-right three-step flow with three modular blocks connected by arrows or connector lines, visual logic of input request, one-click generation, direct use, clean enterprise infographics style, strong readability, bold geometric layout, blue teal white dark gray palette, rounded nodes and status chips, open text placeholders for later Chinese labels, graphic-composite design, one scene only, not storyboard, not contact sheet, not multi-panel
- Negative Constraints: no realistic hands using phone, no whiteboard sketch, no too many steps, no tiny paragraph text, no presentation slide borders
- Tool Note: composition should stay simple enough to animate with short connector and highlight motion

### Shot 5

- Shot ID: 05
- Shot Use: before/after benefit comparison
- Copy-Paste Prompt: single frame only, 16:9 split-screen motion graphics comparison, left side feels manual and time-consuming, right side feels fast and efficient, strong contrast through layout clarity rather than realism, left side denser and duller, right side cleaner with checkmark pulses implied, enterprise enablement visual language, blue teal white dark gray palette, rounded blocks and checklist icons, clear center divider, reserve simple text zones on both sides for later compositing, graphic-composite style, not storyboard, not contact sheet, not pitch board
- Negative Constraints: no photo collage, no multi-panel comic, no realistic office workers, no extra scenes, no dense spreadsheet screenshot
- Tool Note: the right side should feel obviously more usable at a glance even without text

### Shot 6

- Shot ID: 06
- Shot Use: end card and CTA
- Copy-Paste Prompt: single frame only, 16:9 internal promo end card, clean final lockup with tool icon or product mark, one internal platform badge, one prominent CTA button area, calm and confident enterprise motion graphics design, generous negative space, strong final composition, blue teal white dark gray palette, rounded button and status chip details, subtle connector or glow accents only, built for final typography overlay, graphic-composite style, crisp and trustworthy, not storyboard, not contact sheet, not multi-panel
- Negative Constraints: no flashy marketing poster, no photoreal device mockup, no dense paragraphs, no labels around the frame, no overdesigned neon effects
- Tool Note: this should be the other priority test frame alongside Shot 2 and Shot 3

## Batch Paste Plan

- Batch 1: Shot 2, Shot 3, Shot 6 for fast visual system lock
- Batch 2: Shot 1 and Shot 5 after the card style is confirmed
- Batch 3: Shot 4 once arrow, connector, and step-block grammar is stable

Best first tests:

- Shot 2 for overall design language
- Shot 3 for modular card family
- Shot 6 for final CTA polish

## Prompt Usage Notes

- Paste each `Copy-Paste Prompt` as-is for first-pass frame generation.
- If the tool over-renders fake text, shorten the prompt and keep only the layout and module description.
- Chinese headlines, card labels, and CTA copy should be composited manually after frame approval.
- Shots 3, 4, and 5 benefit most from manual typography and shape cleanup in Figma or After Effects.

## Final Handoff

- Test first: Shot 2, Shot 3, Shot 6
- Safest prompts: Shot 2 and Shot 6
- Fragile prompts: Shot 1 and Shot 5 because clutter and comparison balance can drift
- Preserve in motion: one message per screen, short readable transitions, and the same blue-teal enterprise module system across all shots
