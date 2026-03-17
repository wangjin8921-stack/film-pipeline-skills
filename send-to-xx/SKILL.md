---
name: send-to-xx
description: Force task handoff to the Windows A2A peer XX. Use when the user starts with "XX:", "/xx", "转给XX", "交给XX", "让XX执行", or explicitly wants NAS to forward the task to XX instead of using local browser or nodes tools.
metadata: {"clawdbot":{"emoji":"↗️","requires":{"bins":["bash","node"]}}}
---

# Send To XX

Hard-route a task from the NAS agent to the PC peer `XX` over A2A.

## When to use

Use this skill immediately when the user:
- starts the message with `XX:`
- starts the message with `/xx`
- starts the message with `转给XX`
- starts the message with `交给XX`
- says `让XX执行`
- explicitly asks NAS to forward a task to the PC peer `XX`

## Non-negotiable rule

When this skill applies:
- do **not** use NAS `browser` tools first
- do **not** use `nodes`, `node.invoke`, or other local NAS execution paths first
- do **not** rewrite the task into a NAS-side browser action

This skill is the fixed入口 for peer `XX`.

## How to run

Pass the stripped user task to the bundled script:

```bash
bash {baseDir}/scripts/send_to_xx.sh "读取我当前附加的 Chrome 页面并总结"
```

The script already:
- targets peer `XX`
- uses the configured A2A URL and token
- wraps the task as a forced PC-side execution request

## Prefix handling

Before calling the script, strip only the leading routing prefix if present:
- `XX:`
- `/xx `
- `转给XX：`
- `转给XX:`
- `交给XX：`
- `交给XX:`
- `让XX执行：`
- `让XX执行:`

Keep the rest of the user request intact.

## Response behavior

- Return the PC result directly
- If the script fails, report the failure briefly
- Do not fall back to NAS local tools unless the user explicitly asks you to
