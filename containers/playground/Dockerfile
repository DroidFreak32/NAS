FROM alpine

ARG UID
ARG GID

# Create a new user matching host's current user
RUN addgroup -g ${GID} user; \
    adduser -u ${UID} -D -G user user; \
    addgroup user wheel; exit 0

ENTRYPOINT [ "sh" ]
