#!/bin/bash

set -e

KIND=${1:-patch}
HERE=`dirname $0`
PROJECT_ROOT="$HERE/.."

if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then
    echo "ERROR: Release aborted, local changes detected."
    #exit 1
fi

echo "INFO: Starting Release"

# npmInstallFor $PACKAGE_PATH
function npmRelease {
  PACKAGE_PATH=$1
  echo "INFO: Bump version $PROJECT_ROOT/$PACKAGE_PATH"
  pushd $PROJECT_ROOT/$PACKAGE_PATH
  npm --no-git-tag-version version $KIND
  popd
}

function npmBuild {
  PACKAGE_PATH=$1
  echo "INFO: Build $PROJECT_ROOT/$PACKAGE_PATH"
  pushd $PROJECT_ROOT/$PACKAGE_PATH
  npm run build:production
  popd
}

npmRelease ""
npmRelease "client"
echo "INFO: Release successfully bumped"

echo "INFO: start release"
rm -rf $PROJECT_ROOT/docs/*
rm -rf $PROJECT_ROOT/dist/*

npmBuild ""
npmBuild "client"

cp -rf $PROJECT_ROOT/dist/* $PROJECT_ROOT/docs