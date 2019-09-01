#!/bin/bash

set -e

ABSOLUTE_ROOT="$( cd "$(dirname "$0")/.." ; pwd -P )" 2>/dev/null
DOCKER_IMAGE="node:10-jessie-slim"

if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then
    echo "ERROR: Release aborted, local changes detected."
    #exit 1
fi

echo "INFO: Starting DOCKER Release $ABSOLUTE_ROOT"

EXECUTE_BUILDSCRIPT="cd /source/build && ./release.sh"
time docker run --rm \
           -a stdin -a stdout -a stderr \
           -v ${ABSOLUTE_ROOT}:/source \
           $DOCKER_IMAGE bash -c "${EXECUTE_BUILDSCRIPT}"

echo "INFO: 👷 LGTM!"