#!/usr/bin/env sh
# Create log file if not exists so the container stays up
touch /weechat/weechat.log

# As per https://latest.glowing-bear.org/ -> "Use TLS encryption" section
# This variable is set in compose definition
cat /etc/letsencrypt/live/$MY_DOMAIN/fullchain.pem /etc/letsencrypt/live/$MY_DOMAIN/privkey.pem > /weechat/tls/relay.pem

# Don't screw up permissions
chown user:user -R /weechat

# Don't run headlessly but don't use current tty either
su user -c "screen -d -m weechat"
# su -c "screen -d -m python3 -m http.server -b :: 9001 -d /tmp/"

# Keep the container alive
tail -n1 -f /weechat/weechat.log
