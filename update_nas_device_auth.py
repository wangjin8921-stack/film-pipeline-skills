import json
path = '/vol1/docker/volumes/openclaw_data/_data/identity/device-auth.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)
op = data.setdefault('tokens', {}).setdefault('operator', {})
op['token'] = 'NaRtHal3bdjbbQMG2iqzS8SiOqYNViUQ-N287fCegQk'
op['role'] = 'operator'
op['scopes'] = ['operator.admin', 'operator.approvals', 'operator.pairing', 'operator.read', 'operator.write']
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')
print('updated', path)
