#!/bin/sh
set -eu
BACKUP_DIR=/vol1/1000/1/openclaw
ARCHIVE="/openclaw-state-20260316-210217.tar.gz"
SHA=".sha256"
PASS='Wangjin8921'
restart_container() {
  printf '%s\n' "" | sudo -S -p '' docker start openclaw >/dev/null || true
}
printf '%s\n' "" | sudo -S -p '' docker stop openclaw >/dev/null
trap restart_container EXIT
mkdir -p ""
printf '%s\n' "" | sudo -S -p '' tar -czf "" -C /vol1/docker/volumes/openclaw_data _data
printf '%s\n' "" | sudo -S -p '' sha256sum "" > ""
restart_container
trap - EXIT
ls -lh "" ""