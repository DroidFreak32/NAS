# ------------------------------------------------------------------------------
# Build shadowbg-frontend
FROM ghcr.io/oss-app-forks/shadowbg:latest AS base

FROM scratch
COPY --from=base / /

# Define default command
CMD ["/app/app.sh"]
