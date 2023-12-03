#!/usr/bin/env sh
cd /tmp/
wget 'http://openresty.org/package/admin@openresty.com-5ea678a6.rsa.pub'
mv 'admin@openresty.com-5ea678a6.rsa.pub' /etc/apk/keys/

# then, add the repo:
. /etc/os-release
MAJOR_VER=`echo $VERSION_ID | sed 's/\.[0-9]\+$//'`

echo "http://openresty.org/package/alpine/v$MAJOR_VER/main" \
    | tee -a /etc/apk/repositories

# update the local index cache:
apk update
apk add openresty openresty-resty goaccess

# Remove the default nginx config
rm /etc/nginx/http.d/default.conf

# Create stats directory
mkdir -p /var/log/nginx/stats