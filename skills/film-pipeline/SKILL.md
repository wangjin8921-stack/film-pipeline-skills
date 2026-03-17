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

Do not replace the four specialist skills. Route work through them in order and manage the project artifacts between them.

If the user provides a reference video, benchmark piece, or asks for calibration against a real example, treat that example as a case reference rather than a template.
For a workflow-led enterprise MG example, read [references/super-rep-mg-case.md](references/super-rep-mg-case.md).
For a product-world geometric MG example, read [references/iot-product-mg-case.md](references/iot-product-mg-case.md).
To expand MG references systematically, read [references/mg-benchmark-matrix.md](references/mg-benchmark-matrix.md).
For style-led AIGC teaser or poster references, read [references/bv-aigc-style-case.md](references/bv-aigc-style-case.md) and [references/aigc-visual-style-benchmark-matrix.md](references/aigc-visual-style-benchmark-matrix.md).
For motion-led object-travel references, read [references/bc-aigc-motion-case.md](references/bc-aigc-motion-case.md).

## Main Goal

Turn one film brief into a checkpointed project workflow that:

- saves each step as its own file
- allows manual edits after any step
- supports rerunning from a later step
- supports rerunning only one step
- keeps downstream dependencies explicit

## Default Input Contract

If the user says "use `film-pipeline`" or clearly asks for the full filmmaking flow, normalize the request into this structure before running:

- `theme`
- `video_type`
- `platform`
- `duration_seconds`
- `target_audience`
- `style_keywords`
- `core_goal`
- `constraints`

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
- `tool_preferences`: optional named generation tools for Step 4
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

Optional companion file for Step 5:

- `05_step5_generation_prompts_zh.md`

Treat these as working master files, not disposable chat logs.
By default, their full paths should be:

- `work/film/<project-folder>/00_project_summary.md`
- `work/film/<project-folder>/01_step1_directing_brief.md`
- `work/film/<project-folder>/02_step2_storyboard.md`
- `work/film/<project-folder>/03_step3_prompt_package.md`
- `work/film/<project-folder>/04_step4_execution_plan.md`
- `work/film/<project-folder>/05_step5_generation_prompts.md`

If Step 5 outputs a Chinese companion file, write it as:

- `work/film/<project-folder>/05_step5_generation_prompts_zh.md`

The Chinese companion file is helpful but optional.
Do not treat it as part of the required 6 standard files for project completion tracking.

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
7. update `00_project_summary.md` with current file statuses and next actions

### `rerun_from`

Use when one step was edited and all downstream steps must be regenerated.

Interpretation:

- `step-2` means reuse Step 1 and regenerate 2, 3, 4
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
- `step-5` updates only `05_step5_generation_prompts.md`

After a `rerun_only`, update `00_project_summary.md` so the user can see which downstream files are now stale.

## Execution Procedure

### 1. Normalize The Project Brief

Extract the film brief and determine whether this is:

- a fresh full run
- a continuation after edits
- a one-step refresh

If details are missing, infer reasonable defaults and state them briefly.

If `video_type` is missing:

- run an explicit type-identification checkpoint before Step 1
- choose exactly one supported profile from `step-1-film-director/references/video_type_profiles.md`
- base the choice on the dominant communication mechanism first, not on audience, platform, or corporate tone words alone
- record the chosen normalized type and the brief reason in Step 1 so downstream steps can follow the same lane
- do not invent labels such as `系统演示/企业汇报片` as the normalized type

If the user explicitly asks to see how type recognition works:

- make the type-identification reasoning visible in Step 1
- keep the reasoning short, operational, and tied to downstream execution direction

If a benchmark case is provided:

- extract transferable guardrails
- extract freshness levers
- explicitly separate case-specific style from reusable type logic
- do not literal-copy palette, layout, or structure unless the user explicitly asks to match them
- decide whether the benchmark is `structure-led`, `style-led`, or a hybrid before carrying it downstream

### 2. Check Existing Artifacts

Before running a step, identify the correct project folder under `work/film/` first.

Then look for the standard files inside that project folder.

If matching legacy files still exist directly under `work/` or directly under `work/film/`, prefer the project-folder copies once they exist.

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

Do not collapse multiple steps into one giant output. Each step must remain separately reviewable.

If Step 1 inferred `video_type` rather than receiving it explicitly:

- verify that the Step 1 output names one supported normalized type
- verify that Step 2 through Step 4 keep following that same normalized lane
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
- generation order priorities
- tool and workflow assumptions that affect prompt wording

Step 5 may expand:

- copy-paste-ready prompt phrasing
- tool-specific syntax and guardrails
- single-frame vs motion prompt split
- anti-storyboard / anti-contact-sheet constraints

## Manual Edit Rules

Assume the user may modify any of:

- `01_step1_directing_brief.md`
- `02_step2_storyboard.md`
- `03_step3_prompt_package.md`
- `04_step4_execution_plan.md`
- `05_step5_generation_prompts.md`

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
- Keep summaries compact.
- Preserve the distinct structure of each specialist skill.
- Make it obvious what the user should review next.

## Good Result Standard

A good `film-pipeline` run leaves the project directory with:

- one summary file
- five step files
- clear status markers
- a safe continuation point after manual edits

The user should be able to:

- review after any step
- edit any step file
- rerun only what changed
- continue the pipeline without re-explaining the whole project
