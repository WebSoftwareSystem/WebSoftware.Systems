#!/usr/bin/env bash

function _heading {
    echo "[WSS:Workspace:02] ${1}"
}

################################################################################
_heading "Start booting shell workspace."
################################################################################

# TODO: Ensure CWD is at root of repo.


################################################################################
_heading "Exporting core workspace environment variables."
################################################################################

export WSS_WORKSPACE_ROOT_PATH="$(pwd)"
export WSS_WORKSPACE_INSTRUCTIONS_ROOT_PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/#!inf.json"

export PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules/.bin:${PATH}"
export NODE_PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules:${NODE_PATH}"


# TODO: Test requirements.

################################################################################
_heading "Ensuring 'node' v12.13 using 'nvm'."
################################################################################

#nvm use 12.13


################################################################################
_heading "Ensuring 'pinf.it' is installed."
################################################################################

pushd "${WSS_WORKSPACE_ROOT_PATH}/#!" > /dev/null
    if [ ! -e "package.json" ]; then
        echo '{}' > package.json
    fi
    if [ ! -e "${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules/.bin/pinf.it" ]; then
        npm install @pinf-it/core@0.1.0-pre.0
    fi
popd > /dev/null


################################################################################
_heading "Run workspace instructions from './#!/#!inf.json' using 'pinf.it'."
################################################################################

pushd "${WSS_WORKSPACE_ROOT_PATH}" > /dev/null

    pinf.it ./

popd > /dev/null
