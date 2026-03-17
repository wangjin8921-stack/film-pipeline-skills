# OpenClaw 恢复说明

备份文件：
- /vol1/1000/1/openclaw/openclaw-state-20260316-210301.tar.gz
- /vol1/1000/1/openclaw/openclaw-state-20260316-210301.tar.gz.sha256

当前 OpenClaw 持久数据目录：
- /vol1/docker/volumes/openclaw_data/_data

说明：
- 这份备份是整个 OpenClaw 持久数据卷的完整打包。
- 恢复后会覆盖当前 OpenClaw 的配置、workspace、memory、sessions、自定义插件等数据。
- 如果当前 NAS 上已经有新的 OpenClaw 数据，恢复前建议先再备份一次当前状态。

一、恢复前准备
1. 确认备份文件存在：
   ls -lh /vol1/1000/1/openclaw/openclaw-state-20260316-210301.tar.gz
2. 校验备份完整性：
   sha256sum -c /vol1/1000/1/openclaw/openclaw-state-20260316-210301.tar.gz.sha256
3. 确认 docker 容器名仍然是：openclaw

二、标准恢复步骤
1. 停止容器：
   printf '%s\n' 'Wangjin8921' | sudo -S docker stop openclaw

2. 备份当前现场（强烈建议）：
   TS=$(date +%Y%m%d-%H%M%S)
   printf '%s\n' 'Wangjin8921' | sudo -S tar -czf /vol1/1000/1/openclaw/pre-restore-$TS.tar.gz -C /vol1/docker/volumes/openclaw_data _data

3. 清空当前持久数据目录：
   printf '%s\n' 'Wangjin8921' | sudo -S rm -rf /vol1/docker/volumes/openclaw_data/_data

4. 重新创建目录：
   printf '%s\n' 'Wangjin8921' | sudo -S mkdir -p /vol1/docker/volumes/openclaw_data/_data

5. 解压恢复：
   printf '%s\n' 'Wangjin8921' | sudo -S tar -xzf /vol1/1000/1/openclaw/openclaw-state-20260316-210301.tar.gz -C /vol1/docker/volumes/openclaw_data

   注意：
   - 这个备份包里包含的是 _data 目录本身，解压目标要写到 /vol1/docker/volumes/openclaw_data
   - 不要解压到 /vol1/docker/volumes/openclaw_data/_data 里面，否则会多套一层目录

6. 启动容器：
   printf '%s\n' 'Wangjin8921' | sudo -S docker start openclaw

7. 检查状态：
   printf '%s\n' 'Wangjin8921' | sudo -S docker ps --filter name=openclaw
   printf '%s\n' 'Wangjin8921' | sudo -S docker logs --tail 100 openclaw

三、恢复后建议验证
1. Telegram 是否正常回复
2. /deep 是否可用
3. /xx 是否可用
4. A2A 到 XX 是否正常
5. NAS 内置浏览器任务是否正常
6. 重要自定义文件是否还在：
   - /vol1/docker/volumes/openclaw_data/_data/openclaw.json
   - /vol1/docker/volumes/openclaw_data/_data/workspace/AGENTS.md
   - /vol1/docker/volumes/openclaw_data/_data/workspace/TOOLS.md
   - /vol1/docker/volumes/openclaw_data/_data/workspace/plugins/subagent-shortcuts
   - /vol1/docker/volumes/openclaw_data/_data/workspace/plugins/xx-shortcuts

四、快速回滚
如果恢复后有问题，可以把第二步生成的 pre-restore-时间戳.tar.gz 按同样方法再恢复回去。

五、适用场景
- 官方升级后功能异常，快速回滚
- 新 NAS / 新机器迁移
- 重装 OpenClaw 后恢复原有状态