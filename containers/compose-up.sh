#!/bin/bash

# docker compose --env-file ./.env build
# docker compose --env-file ./.env -f public/docker-compose.yml build
# docker compose --env-file ./.env -f private/docker-compose.yml build

docker compose --env-file ./.env up -d
docker compose --env-file ./.env -f public/docker-compose.yml up -d
docker compose --env-file ./.env -f private/docker-compose.yml up -d
# docker compose --env-file ./.env -f heavy_containers/bazarr.yml up -d
# docker compose --env-file ./.env -f heavy_containers/flaresolverr.yml up -d
# docker compose --env-file ./.env -f heavy_containers/jd2.yml up -d
# docker compose --env-file ./.env -f heavy_containers/sharelatex.yml up -d
