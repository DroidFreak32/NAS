#!/bin/bash

# Usage:
# bash gen-traefik-labels.sh <SERVICE_NAME> <PORT> [hostname]
#
# For example,
#
# $ bash gen-traefik-labels.sh jdownloader2 5800
#
# generates:
#
#       - "traefik.enable=true"
#       - "traefik.http.routers.jdownloader2.rule=Host(`jdownloader2.$MY_DOMAIN_VPN`)"
#       - "traefik.http.routers.jdownloader2.entrypoints=web"
#       - "traefik.http.services.jdownloader2.loadbalancer.server.port=5800"
#
# $ bash gen-traefik-labels.sh jdownloader2 5800 jd2
#
# generates:
#
#       - "traefik.enable=true"
#       - "traefik.http.routers.jdownloader2.rule=Host(`jd2.$MY_DOMAIN_VPN`)"
#       - "traefik.http.routers.jdownloader2.entrypoints=web"
#       - "traefik.http.services.jdownloader2.loadbalancer.server.port=5800"

SERVICE_NAME="$1"
PORT="$2"

if [ -z "$3" ]; then
    HOSTNAME="$SERVICE_NAME"
else
    HOSTNAME="$3"
fi

echo "    labels:
      - \"traefik.enable=true\"
      - \"traefik.http.routers.$SERVICE_NAME.rule=Host(\`$HOSTNAME.\$TRAEFIK_PRIVATE_DOMAIN\`)\"
      - \"traefik.http.routers.$SERVICE_NAME.entrypoints=web\"
      - \"traefik.http.services.$SERVICE_NAME.loadbalancer.server.port=$PORT\"

      # Manually forcing https
      - \"traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https\"
      - \"traefik.http.routers.$SERVICE_NAME.middlewares=redirect-to-https\"
      # Instead of above, you can also use any existing Middleware in the traefik yml config's Dynamic Config section
      # comment above two lines and add uncomment this
      # - \"traefik.http.routers.$SERVICE_NAME.middlewares=https-redirectscheme@file\"

      # Needs another router for HTTPS
      - \"traefik.http.routers."$SERVICE_NAME"_sec.rule=Host(\`$HOSTNAME.\$TRAEFIK_PRIVATE_DOMAIN\`)\"
      - \"traefik.http.routers."$SERVICE_NAME"_sec.entrypoints=websecure\"
      - \"traefik.http.routers."$SERVICE_NAME"_sec.tls=true\"
"