#!/bin/bash

# docker compose --env-file ./.env build
# docker compose --env-file ./.env -f public/docker-compose.yml build
# docker compose --env-file ./.env -f private/docker-compose.yml build

docker compose --env-file ./.env -f private/docker-compose.yml stop
docker compose --env-file ./.env -f public/docker-compose.yml stop
docker compose --env-file ./.env stop
