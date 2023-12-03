#!/bin/sh
# Substitute env vars in the nginx conf
envsubst '${SUBDOMAIN},${DOMAIN}' < /etc/nginx/templates/template.conf > /etc/nginx/http.d/default.conf
nohup watch -n 60 goaccess /var/log/nginx/${SUBDOMAIN}.${DOMAIN}/access.log -o /var/log/nginx/stats/index.html --log-format=COMBINED &
openresty -c /etc/nginx/nginx.conf -g 'daemon off;'