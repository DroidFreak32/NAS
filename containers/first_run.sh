#!/bin/env bash
touch .env
source .env

sudo mkdir -p /etc/letsencrypt/live /etc/letsencrypt/traefik
sudo chown -R "$(id -un):$(id -gn)" /etc/letsencrypt

sudo ipset create docker-ipv4 hash:net
sudo ipset create docker-ipv6 hash:net family inet6
sudo ipset add docker-ipv6 "$DOCKER_NETWORK_IPV6_SUBNET"
sudo ipset add docker-ipv4 "$DOCKER_NETWORK_IPV4_SUBNET"

sudo ipset save | sudo tee -a /etc/iptables/ipsets

docker network create -d bridge $DOCKER_NETWORK_NAME --ipv6 \
    -o "com.docker.network.bridge.name=$DOCKER_NETWORK_NAME" \
    --subnet "$DOCKER_NETWORK_IPV4_SUBNET" \
    --subnet "$DOCKER_NETWORK_IPV6_SUBNET"
