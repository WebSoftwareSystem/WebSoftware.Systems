#!/usr/bin/env bash

([ ! -e .tmp ] || rm -Rf .tmp) && mkdir .tmp

pushd .tmp > /dev/null

    if [ ! -e .git ]; then
        git init
        # TODO: Make repository configurable
        git remote add origin git@github.com:WebSoftwareSystem/Test_Use.git
    fi

    if [ ! -e "#!" ]; then
        "../../../#!/websoftware.systems/bin/wss" init
    fi

    ./run.sh help

popd > /dev/null
