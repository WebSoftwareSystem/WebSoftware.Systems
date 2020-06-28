#!/usr/bin/env bash

pushd ../.. > /dev/null
    echo "TEST_MATCH_IGNORE>>>"

    ./run.sh publish

    echo "<<<TEST_MATCH_IGNORE"
popd > /dev/null

echo "OK"
