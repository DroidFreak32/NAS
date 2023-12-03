# Using alpine base image instead of nginx-alpine to support fancyindex

FROM alpine:latest

# Get the UID and GID from current environment
ARG UID
ARG GID

# Install necessary packages
RUN apk update && \
    apk add weechat-python weechat-perl screen

# Create a new user matching host's current user
RUN addgroup -g ${GID} user; \
    adduser -u ${UID} -D -G user user; \
    addgroup user wheel; exit 0

COPY --chmod=755 Dockerfiles/weechat_entry.sh /

# Weechat Configs go here
ENV WEECHAT_HOME="/weechat"
ENTRYPOINT [ "/weechat_entry.sh" ]
