# Using alpine base image instead of nginx-alpine to support fancyindex

FROM alpine:3.18

# Install necessary packages
RUN apk update && \
    apk add nginx envsubst

# Copy openresty installer script
COPY --chmod=755 Dockerfiles/install_openresty.sh /
COPY --chmod=755 Dockerfiles/fancyindex_entry.sh /entrypoint.sh

# Install openresty
RUN sh /install_openresty.sh

# For certbot auto-renewal
COPY ./sites/letsencrypt.conf /etc/nginx/snippets/letsencrypt.conf
RUN mkdir -p /var/www/letsencrypt/.well-known/acme-challenge

ENTRYPOINT /entrypoint.sh
