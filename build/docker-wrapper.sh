#!/bin/bash

set -e

ABSOLUTE_ROOT="$( cd "$(dirname "$0")/.." ; pwd -P )" 2>/dev/null
DOCKER_IMAGE="node:22-slim"

if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then
    echo "⚠️  WARNING: local changes detected."
fi

echo "INFO: Starting DOCKER Release $ABSOLUTE_ROOT"

EXECUTE_BUILDSCRIPT="cd /source/build && ./release.sh $1"
time docker run --rm \
           -a stdout -a stderr \
           -v ${ABSOLUTE_ROOT}:/source:cached \
           $DOCKER_IMAGE bash -c "${EXECUTE_BUILDSCRIPT}"

echo "INFO: 👷 LGTM!"
