# ------------------------------------------------------------------------------
# Build shadowbg-frontend
FROM ghcr.io/oss-app-forks/shadowbg:latest AS base

FROM scratch
COPY --from=base / /

WORKDIR /app

# Define default command
CMD ["./start.sh"]
