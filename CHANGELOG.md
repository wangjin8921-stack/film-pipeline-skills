# Changelog

All notable changes to this repository will be documented in this file.

## v0.1.0 - 2026-03-17

First publishable baseline.

### Added

- Published the full film workflow as a dedicated repository
- Added `film-pipeline` as the top-level orchestration skill
- Added Step 1 to Step 5 skill modules
- Added the optional `subagent-shortcuts` plugin for `/film` workflow support
- Added a repository README for installation and workflow overview

### Changed

- Clarified the role split between Step 3 and Step 5
- Defined Step 3 as the strategy layer / prompt design brief
- Defined Step 5 as the final delivery layer / final prompt delivery pack
- Updated Step 5 to support:
  - English primary prompt output
  - Chinese companion output
  - cleaner separation between model-facing prompts and human-facing reference content

### Workflow Improvements

- Added Step 5 into the runnable `/film` chain
- Improved resume behavior so manual edits to an upstream step can continue from the next downstream step
- Added support for alternate MG Step 3 filename handling in the plugin flow

### Notes

- English Step 5 output is intended to remain model-facing and cleaner for execution
- Chinese companion output is intended for translation, review, and optional Chinese prompt experimentation
