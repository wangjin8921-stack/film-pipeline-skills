---
name: film-pipeline
description: Unified controller for the five-step AI filmmaking workflow. Use this when the user wants one entry point that turns a video idea into Step 1 directing brief, Step 2 storyboard, Step 3 prompt package, Step 4 execution plan, and Step 5 direct generation prompts, especially when they need checkpoint files, manual edits between steps, reruns from a specific step, or reruns of only one step.
---

# Film Pipeline

Use this skill as the orchestration layer around these existing skills:

- `step-1-film-director`
- `step-2-film-scriptboard`
- `step-3-prompt-director`
- `step-4-shot-executor`
- `step-5-director-prompts`

Do not replace the five specialist skills.
Route work through them in order and manage the project artifacts between them.

If the user provides a reference video, benchmark piece, or asks for calibration against a real example, treat that example as a case reference rather than a template.
For a workflow-led enterprise MG example, read [references/super-rep-mg-case.md](references/super-rep-mg-case.md).
For a product-world geometric MG example, read [references/iot-product-mg-case.md](references/iot-product-mg-case.md).
For MG reference expansion, read [references/mg-benchmark-matrix.md](references/mg-benchmark-matrix.md).
For style-led AIGC references, read [references/bv-aigc-style-case.md](references/bv-aigc-style-case.md) and [references/aigc-visual-style-benchmark-matrix.md](references/aigc-visual-style-benchmark-matrix.md).
For motion-led object-travel references, read [references/bc-aigc-motion-case.md](references/bc-aigc-motion-case.md).

## Main Goal

Turn one film brief into a checkpointed project workflow that:

- saves each step as its own file
- allows manual edits after any step
- supports rerunning from a later step
- supports rerunning only one step
- keeps downstream dependencies explicit

Critical rule:

- Step 1 through Step 4 must keep the full specialist depth of their own skills
- only Step 5 should compress into the shortest copy-paste execution format
- do not globally simplify the whole pipeline just because Step 5 is intentionally minimal

## Default Input Contract

If the user says "use `film-pipeline`" or clearly asks for the full filmmaking flow, normalize the request into this structure before running:

- `theme`
- `video_type`
- `platform`
- `duration_seconds`
- `target_audience`
- `core_goal`
- `structure_requirement`
- `style_direction`
- `reference_keywords`
- `avoid`
- `hard_constraints`
- `constraints`

Interpret the normalized brief in this priority order:

1. `core_goal`
2. `structure_requirement`
3. `style_direction`
4. `reference_keywords`
5. `avoid`
6. `hard_constraints`
7. `constraints`

Treat `style_keywords` as a legacy alias only:

- if the user provides `style_keywords`, split it into `style_direction` and `reference_keywords`
- mood, tone, pacing, and brand-language words belong under `style_direction`
- concrete image nouns such as `particles`, `big title`, `helix`, `logo wall`, or `metal tunnel` belong under `reference_keywords`
- do not let one or two concrete element nouns become the whole film skeleton unless the user explicitly says they are mandatory
- if the user supplies only element-heavy keywords, infer a broader `style_direction` and state that default briefly

Interpret `video_type` with this priority:

- if the user explicitly names a supported type such as `MG explainer`, `enterprise promo`, or `UI demo`, preserve that type as the working source of truth
- do not silently override an explicit type just because nearby fields suggest a different tone or platform fit
- only infer `video_type` when the user did not provide one
- when inferring, choose exactly one supported dominant lane rather than inventing a hybrid label

Also detect these control fields if the user provides them:

- `project`: target project folder name under `work/film/`
- `mode`: `run_all`, `rerun_from`, or `rerun_only`
- `step`: `step-1`, `step-2`, `step-3`, `step-4`, or `step-5`
- `manual_change_note`: what changed and what must now be preserved
- `tool_preferences`: optional named generation tools that affect Step 4 routing or Step 5 prompt wording
- `reference_case`: optional benchmark video or benchmark style note

Defaults:

- if no mode is given, use `run_all`
- if the user wants to continue after editing a middle step, infer `rerun_from`
- if the user wants to update just one deliverable, infer `rerun_only`

## Standard Project Files

Default root directory:

- use `work/film/` as the root for all film projects
- keep one subfolder per project under `work/film/`
- keep `work/film/_index.md` as the lightweight project list
- if `work/film/` does not exist yet, create it before writing outputs

Project folder rule:

- every project must write into `work/film/<project-folder>/`
- never mix files from different projects in the same directory
- if the user provides `project`, use that folder
- if no project is provided for a new job, generate a folder name from `YYYYMMDD_<project-short-name>`
- if the user asks to continue and no project is given, prefer the latest active project only when that intent is clear

Inside each project folder, use these filenames unless the user already has an established naming scheme:

- `00_project_summary.md`
- `01_step1_directing_brief.md`
- `02_step2_storyboard.md`
- `03_step3_prompt_package.md`
- `04_step4_execution_plan.md`
- `05_step5_generation_prompts.md`
- `05_step5_generation_prompts_zh.md`

Treat these as working master files, not disposable chat logs.

`work/film/_index.md` should list:

- project folder
- current status
- file count
- last updated time

## File Header Contract

At the top of every step file, include a short metadata block in plain Markdown text:

```md
Project: <working title>
Step: step-1
Status: draft
Edited: agent
Depends on: source brief
Next recommended action: review step-1 or run step-2
```

Adapt the values per file. Use concise values such as:

- `Status`: `draft`, `approved`, `manual-edit`, or `stale`
- `Edited`: `agent` or `manual`
- `Depends on`: the upstream file or source brief
- `Next recommended action`: the next sensible pipeline move

If a file was hand-edited or the user explicitly revised it, mark it `Edited: manual`.

## Workflow Decision Rules

Follow this dependency chain exactly:

- `step-2` depends on `step-1`
- `step-3` depends on `step-2`
- `step-4` depends on `step-3`
- `step-5` depends on `step-4`

When a step changes, mark downstream logic as stale:

- if `step-1` changes, `step-2`, `step-3`, `step-4`, and `step-5` are stale
- if `step-2` changes, `step-3`, `step-4`, and `step-5` are stale
- if `step-3` changes, `step-4` and `step-5` are stale
- if `step-4` changes, `step-5` is stale
- if `step-5` changes, nothing upstream becomes stale

Do not silently pretend stale downstream files are still valid.

## Operation Modes

### `run_all`

Use for a fresh project or when the user wants the whole pipeline regenerated.

Execution order:

1. build or refresh `00_project_summary.md`
2. run `step-1-film-director` and save `01_step1_directing_brief.md`
3. run `step-2-film-scriptboard` from the Step 1 file and save `02_step2_storyboard.md`
4. run `step-3-prompt-director` from the Step 2 file and save `03_step3_prompt_package.md`
5. run `step-4-shot-executor` from the Step 3 file and save `04_step4_execution_plan.md`
6. run `step-5-director-prompts` from the Step 4 file and save `05_step5_generation_prompts.md`
7. save the Chinese Step 5 companion as `05_step5_generation_prompts_zh.md`
8. update `00_project_summary.md` with current file statuses and next actions

### `rerun_from`

Use when one step was edited and all downstream steps must be regenerated.

Interpretation:

- `step-2` means reuse Step 1 and regenerate 2, 3, 4, 5
- `step-3` means reuse Steps 1 and 2 and regenerate 3, 4, 5
- `step-4` means reuse Steps 1, 2, 3 and regenerate 4, 5
- `step-5` means reuse Steps 1, 2, 3, 4 and regenerate 5

If the user says they manually changed Step 2, Step 3, or Step 4 and wants the flow to continue, prefer `rerun_from`.
If the user manually edited a step and wants to continue, resume from the next downstream step rather than overwriting the edited file.

### `rerun_only`

Use when the user wants exactly one deliverable refreshed without automatically continuing.

Interpretation:

- `step-1` updates only `01_step1_directing_brief.md`
- `step-2` updates only `02_step2_storyboard.md`
- `step-3` updates only `03_step3_prompt_package.md`
- `step-4` updates only `04_step4_execution_plan.md`
- `step-5` updates only `05_step5_generation_prompts.md` and `05_step5_generation_prompts_zh.md`

After a `rerun_only`, update `00_project_summary.md` so the user can see which downstream files are now stale.

## Execution Procedure

### 1. Normalize The Project Brief

Extract the film brief and determine whether this is:

- a fresh full run
- a continuation after edits
- a one-step refresh

If details are missing, infer reasonable defaults and state them briefly.

When normalizing the brief, separate:

- communication goal
- structure intent
- style direction
- reference elements
- hard boundaries

Do not treat reference elements as mandatory whole-film structure by default.
They are local inspiration unless the user clearly frames them as required anchors.

If `video_type` is missing:

- run an explicit type-identification checkpoint before Step 1
- choose exactly one supported profile from `step-1-film-director/references/video_type_profiles.md`
- base the choice on the dominant communication mechanism first, not on audience, platform, or corporate tone words alone
- record the chosen normalized type and the brief reason in Step 1 so downstream steps can follow the same lane
- do not invent hybrid labels such as `system demo / enterprise report film` as the normalized type

If the user explicitly asks to see how type recognition works:

- make the type-identification reasoning visible in Step 1
- keep the reasoning short, operational, and tied to downstream execution direction

If a benchmark case is provided:

- extract transferable guardrails
- extract freshness levers
- explicitly separate case-specific style from reusable type logic
- do not literal-copy palette, layout, or structure unless the user explicitly asks to match them
- decide whether the benchmark is `structure-led`, `style-led`, or a hybrid before carrying it downstream

For `Opening Video` or adjacent event-led brand-opening formats:

- if `duration_seconds` is `60` or more, default to a multi-section opening structure rather than a single-motif short-form loop
- prefer `3-5` distinct content layers or visual systems when the duration and brief support it
- let brand DNA stay consistent across the film, but allow different sections to use different visual systems, environments, or information loads
- if business, system, factory, people, device, or global-capability material enters the film, treat it as selective proof inside an opening arc rather than a reason to drift into `Enterprise Promo`
- keep ceremony, escalation, stage-facing clarity, and reveal priority stronger than report-style completeness or profile coverage
- do not stretch a `particles -> title -> logo reveal` idea across the whole runtime unless the user explicitly asks for a minimal single-motif treatment
- if the user asks for a highly minimal opening, preserve that choice and state that the film is intentionally single-system

### 2. Check Existing Artifacts

Before running a step, identify the correct project folder under `work/film/` first.
Then look for the standard files inside that project folder.

Prefer existing upstream files over reconstructing them from chat when they already exist.

If a requested rerun would overwrite a likely manual edit and the user did not ask for that overwrite, pause and confirm before replacing it.

If the same artifact exists in a legacy location and in `work/film/<project-folder>/`, treat the project-folder copy as the active source of truth and avoid updating the legacy copy.

### 3. Run The Target Step Through The Specialist Skill

For each pipeline stage, invoke the corresponding skill and preserve the upstream creative intent:

- Step 1 uses `step-1-film-director`
- Step 2 uses `step-2-film-scriptboard`
- Step 3 uses `step-3-prompt-director`
- Step 4 uses `step-4-shot-executor`
- Step 5 uses `step-5-director-prompts`

Do not collapse multiple steps into one giant output.
Each step must remain separately reviewable.

If Step 1 inferred `video_type` rather than receiving it explicitly:

- verify that the Step 1 output names one supported normalized type
- verify that Step 2 through Step 5 keep following that same normalized lane
- if Step 1 outputs a custom hybrid label instead of a supported type, treat that as a drift and correct it before continuing

When a benchmark case is in play, preserve the distinction between:

- `transferable rules`
- `case-specific choices`

Do not let a benchmark silently become the default style for all future jobs.

### 4. Save The Step Artifact

Each step file must include:

- the metadata header
- the step output itself
- a short closing note saying what the next step should preserve

Exception:

- Step 5 should stay minimal and paste-ready
- if a closing note would make the prompt sheet harder to paste, omit it
- do not leave behind heading-only placeholder files or near-empty shells for any step
- do not claim a step is complete until the real deliverable content has replaced any placeholder text

### 5. Update The Project Summary

`00_project_summary.md` should stay short and operational. Include:

- project definition
- current mode
- which files exist
- status of each step
- what changed most recently
- which step should run next
- which downstream files are stale, if any

Also refresh `work/film/_index.md` so the root directory stays navigable across many projects.

## Step-Specific Handoff Rules

### Step 1 To Step 2

Step 2 must preserve:

- project positioning
- director core thesis
- visual direction
- consistency bible
- shot-count intent

Step 2 may expand:

- section structure
- shot timing
- shot-by-shot action

### Step 2 To Step 3

Step 3 must preserve:

- shot order
- continuity anchors
- time-of-day arc
- protagonist and wardrobe lock
- execution mode per shot

Step 3 may expand:

- image prompt wording
- video prompt wording
- negative constraints
- fallback plans

### Step 3 To Step 4

Step 4 must preserve:

- prompt strategy
- continuity-critical shots
- execution mode logic
- batch opportunities

Step 4 may expand:

- generation order
- tool routing
- retry policy
- folder structure
- QC checklist

### Step 4 To Step 5

Step 5 must preserve:

- per-shot execution intent
- continuity-critical shots
- tool and workflow assumptions that affect prompt wording

Step 5 may expand:

- direct image prompt phrasing
- direct animation prompt phrasing
- short negative prompts
- anti-storyboard / anti-contact-sheet constraints
- placeholder wording for text that should be added in post
- a matching Chinese companion version with the same per-shot structure

## Manual Edit Rules

Assume the user may modify any of:

- `01_step1_directing_brief.md`
- `02_step2_storyboard.md`
- `03_step3_prompt_package.md`
- `04_step4_execution_plan.md`
- `05_step5_generation_prompts.md`
- `05_step5_generation_prompts_zh.md`

When the user says a file was edited:

1. treat that file as the new source of truth for its step
2. mark it `Edited: manual`
3. determine which downstream files became stale
4. continue from the next downstream step unless the user explicitly asks for `rerun_only`

Do not "correct" the user's edit back to an older agent version unless they ask.

Examples:

- edited `step-1` -> continue with `rerun_from step-2`
- edited `step-2` -> continue with `rerun_from step-3`
- edited `step-3` -> continue with `rerun_from step-4`
- edited `step-4` -> continue with `rerun_from step-5`
- edited `step-5` -> no downstream rerun is required

## Failure And Stop Rules

Stop the pipeline if:

- the upstream file required for the next step does not exist
- the previous step output is clearly incomplete or contradictory
- rerunning would overwrite important manual edits without permission

If stopping, explain:

- which step failed or is blocked
- what input is missing or conflicting
- which file should be fixed before continuing

## Output Style Rules

- Keep the pipeline operational, not essay-like.
- Prefer concrete decisions over open-ended options.
- Keep project summaries compact, but preserve full specialist detail inside Step 1 through Step 4.
- Preserve the distinct structure of each specialist skill.
- Make it obvious what the user should review next.
- Treat Step 5 as the shortest execution layer, not a second explanatory document.
- Do not let Step 5's brevity reduce the richness of Step 1 through Step 4.

## Good Result Standard

A good `film-pipeline` run leaves the project directory with:

- one summary file
- five step files
- one Chinese Step 5 companion file
- clear status markers
- a safe continuation point after manual edits

The user should be able to:

- review after any step
- edit any step file
- rerun only what changed
- continue the pipeline without re-explaining the whole project
