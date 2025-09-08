#!/usr/bin/env bash
set -euo pipefail

IF="ppp0"

# Does the interface directory exist under /sys/class/net?
if [[ -d "/sys/class/net/${IF}" ]]; then
    exit 0        # interface present → nothing to do
fi

# Otherwise attempt to bring it up
echo "Restarting ppp0 at $(date)" | systemd-cat -p "warning" -t ppp0-watchdog
/usr/sbin/ifup "${IF}"
