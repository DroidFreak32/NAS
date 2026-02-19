#!/bin/bash

docker compose --env-file ./.env pull
docker compose --env-file ./.env -f public/docker-compose.yml pull
docker compose --env-file ./.env -f private/docker-compose.yml pull
docker compose --env-file ./.env -f heavy_containers/bazarr.yml pull
docker compose --env-file ./.env -f heavy_containers/flaresolverr.yml pull
docker compose --env-file ./.env -f heavy_containers/jd2.yml pull
docker compose --env-file ./.env -f heavy_containers/sharelatex.yml pull
