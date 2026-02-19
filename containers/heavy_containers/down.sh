#!/bin/env bash
for i in "$@"
do
    export service="$(basename "$i" .yml)"
    docker compose -f "$service.yml" stop
done
