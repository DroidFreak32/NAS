FROM ghcr.io/oss-app-forks/traefik-ssl-certificate-exporter:latest as base
ENTRYPOINT [ "/app/entrypoint.sh" ]
