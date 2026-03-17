#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SKILL_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
WORKSPACE_DIR=$(CDPATH= cd -- "$SKILL_DIR/../.." && pwd)

A2A_SEND="$WORKSPACE_DIR/plugins/a2a-gateway/skill/scripts/a2a-send.mjs"
PEER_URL="http://192.168.1.11:18800"
PEER_TOKEN="fe5f6ad5a9fbf1d629b865c110f6ecfcffa2368bfee3da70"
AGENT_ID="main"
TIMEOUT_MS="240000"

if [ ! -f "$A2A_SEND" ]; then
  echo "A2A sender script not found: $A2A_SEND" >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  RAW_MESSAGE="$*"
else
  RAW_MESSAGE=$(cat)
fi

RAW_MESSAGE=$(printf '%s' "$RAW_MESSAGE" | tr -d '\r')
RAW_MESSAGE=$(printf '%s' "$RAW_MESSAGE" | sed \
  -e 's#^[[:space:]]*XX:[[:space:]]*##' \
  -e 's#^[[:space:]]*/xx[[:space:]]*##' \
  -e 's#^[[:space:]]*转给XX[：:[:space:]]*##' \
  -e 's#^[[:space:]]*交给XX[：:[:space:]]*##' \
  -e 's#^[[:space:]]*让XX执行[：:[:space:]]*##')

if [ -z "$(printf '%s' "$RAW_MESSAGE" | tr -d '[:space:]')" ]; then
  echo "Usage: send_to_xx.sh \"<task>\"" >&2
  exit 2
fi

FORWARDED_MESSAGE=$(cat <<EOF
这是来自 NAS 的强制 A2A 转交任务。
你是 Windows 电脑上的 OpenClaw peer「XX」。
你必须在 PC 端执行这个任务，不要把任务退回 NAS。
不要让 NAS 先尝试 browser、nodes 或 node.invoke。
如果任务涉及当前 Chrome、当前标签页、已登录网站或本机浏览器上下文，请优先在 PC 本机浏览器上下文中执行。

原始用户请求：
$RAW_MESSAGE
EOF
)

exec node "$A2A_SEND" \
  --peer-url "$PEER_URL" \
  --token "$PEER_TOKEN" \
  --agent-id "$AGENT_ID" \
  --message "$FORWARDED_MESSAGE" \
  --wait \
  --timeout-ms "$TIMEOUT_MS"
