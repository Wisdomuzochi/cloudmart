#!/bin/bash
set -e

# Ce script tourne en root (USER root dans le Dockerfile)
# Il corrige les permissions du socket Docker puis drop vers jenkins

if [ -S /var/run/docker.sock ]; then
    chmod 666 /var/run/docker.sock
    echo "[entrypoint] docker.sock permissions fixed"
fi

# Drop privileges vers jenkins et lance Jenkins
exec gosu jenkins /usr/bin/tini -- /usr/local/bin/jenkins.sh "$@"
