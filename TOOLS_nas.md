# TOOLS.md - Local Notes

Environment-specific notes. Skills are shared; this is yours.

## Current Setup

### Environment
- NAS Docker container: `openclaw`
- Host: Debian 12
- Docker commands: `sudo docker ...` (from NAS host)

### Channels
- Telegram: configured

### Fixed A2A Entry For XX

When the user starts a message with:
- `XX:`
- `/xx`
- `转给XX`
- `交给XX`
- `让XX执行`

this is a hard routing command, not a soft suggestion.

Run:

```bash
bash /home/node/.openclaw/workspace/skills/send-to-xx/scripts/send_to_xx.sh "<stripped task>"
```

Rules:
- Do not use NAS `browser` first
- Do not use `nodes`, `node.invoke`, or other local execution paths first
- Return XX's result directly
- Do not fall back to NAS tools unless the user explicitly asks

Examples:

```bash
bash /home/node/.openclaw/workspace/skills/send-to-xx/scripts/send_to_xx.sh "读取我当前附加的 Chrome 页面并总结"
```

```bash
bash /home/node/.openclaw/workspace/skills/send-to-xx/scripts/send_to_xx.sh "帮我用本机浏览器完成这个已登录网站操作"
```

### Skills Installed
- weather, summarize, video-frames, nano-banana-pro
- blogwatcher, news-aggregator, tavily
- find-skills, healthcheck
- skill-creator, self-improvement, skill-vetter

### Memory Plugin
- memory-lancedb-pro (LanceDB hybrid retrieval)
- Embedding: jina-embeddings-v5-text-small

### Official Backup (CLI)
- Create + verify (recommended): `openclaw backup create --output /vol1/1000/1/work/backup --verify`
- Dry-run: `openclaw backup create --dry-run --json`
