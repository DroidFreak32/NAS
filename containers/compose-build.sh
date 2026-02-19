#!/bin/bash
export  COMPOSE_BAKE=true
docker compose --env-file ./.env build
docker compose --env-file ./.env -f public/docker-compose.yml build
docker compose --env-file ./.env -f private/docker-compose.yml build
docker compose --env-file ./.env -f heavy_containers/bazarr.yml build
docker compose --env-file ./.env -f heavy_containers/flaresolverr.yml build
docker compose --env-file ./.env -f heavy_containers/jd2.yml build
docker compose --env-file ./.env -f heavy_containers/sharelatex.yml build
