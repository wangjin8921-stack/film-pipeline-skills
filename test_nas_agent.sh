#!/bin/sh
openclaw agent --json --agent main --session-id bootstrap-a2a-test-1 --timeout 120 --message "读取我当前打开的 Chrome 网页主要内容并总结。不要使用 NAS 内置浏览器。"
