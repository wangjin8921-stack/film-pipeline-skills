printf %s Wangjin8921 | sudo -S sh -c 'set -e
mkdir -p /etc/openclaw-proxy/ssl
if [ -f /etc/nginx/ssl/openclaw.crt ] && [ -f /etc/nginx/ssl/openclaw.key ]; then
  cp -f /etc/nginx/ssl/openclaw.crt /etc/openclaw-proxy/ssl/openclaw.crt
  cp -f /etc/nginx/ssl/openclaw.key /etc/openclaw-proxy/ssl/openclaw.key
else
  openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
    -keyout /etc/openclaw-proxy/ssl/openclaw.key \
    -out /etc/openclaw-proxy/ssl/openclaw.crt \
    -subj "/C=CN/ST=NA/L=NA/O=OpenClaw/OU=NAS/CN=192.168.1.150" \
    -addext "subjectAltName=IP:192.168.1.150"
fi
cat > /etc/openclaw-proxy/nginx.conf <<EOF
worker_processes  1;
pid /run/openclaw-proxy.pid;

events { worker_connections 1024; }

http {
  server {
    listen 9443 ssl;
    server_name _;

    ssl_certificate     /etc/openclaw-proxy/ssl/openclaw.crt;
    ssl_certificate_key /etc/openclaw-proxy/ssl/openclaw.key;

    location / {
      proxy_pass http://127.0.0.1:18789;
      proxy_http_version 1.1;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host \$host;
      proxy_set_header X-Forwarded-For \$remote_addr;
      proxy_set_header X-Forwarded-Proto https;
    }
  }
}
EOF
/usr/sbin/nginx -t -c /etc/openclaw-proxy/nginx.conf
/usr/sbin/nginx -c /etc/openclaw-proxy/nginx.conf
if command -v ufw >/dev/null 2>&1; then ufw allow 9443/tcp || true; fi
cp -f /etc/openclaw-proxy/ssl/openclaw.crt /vol1/1000/1/openclaw/openclaw.crt
'
