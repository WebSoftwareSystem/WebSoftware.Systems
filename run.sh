#!/usr/bin/env bash

################################################################################
#-- [WSS] ---------------------------------------------------------------------#
################################################################################

echo "[WSS] Start booting with pwd: $(pwd)"

if [ ! -e "#!/#!workspace.inf.json" ]; then
    echo "[WSS] ERROR: 'run.sh' must be invoked from the root of the WSS repository!"
    exit 1
fi

################################################################################
#-- [WSS:Workspace] -----------------------------------------------------------#
################################################################################


function _HEADING {
    echo "[WSS:Workspace:02] ${1}"
}

function _WSS_EXIT {
    # TODO: Make red
    echo "[WSS:Workspace:02] ERROR: ${2}"
    exit ${1}
}


################################################################################
if [ -z "${CI}" ]; then
    _HEADING "Start booting shell workspace in local development mode."
    export WSS_WORKSPACE_MODE="local-dev"
else
    _HEADING "Start booting shell workspace in continuous integration mode."
    export WSS_WORKSPACE_MODE="ci"
fi


################################################################################
_HEADING "Exporting core workspace environment variables."

export WSS_WORKSPACE_ROOT_PATH="$(pwd)"
export WSS_WORKSPACE_INSTRUCTIONS_ROOT_PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/#!inf.json"

export PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules/.bin:${PATH}"
export NODE_PATH="${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules:${NODE_PATH}"


if [ -z "${CI}" ]; then
    ################################################################################
    _HEADING "Testing local development environment."

    if ! which git > /dev/null; then
        _WSS_EXIT 1 "'git' command not found! Install it yourself and re-run."
    fi

    if ! which docker > /dev/null; then
        _WSS_EXIT 1 "'docker' command not found! Install it yourself and re-run."
    fi

    ################################################################################
    _HEADING "Ensuring 'node' v12.13 using 'nvm'."

    # TODO: Only include if 'nvm' is not found as a function.
    [ ! -e ~/.bash_profile ] || . ~/.bash_profile

    # Long-term support (LTS) - https://nodejs.org/en/about/releases/
    nvm use 12.18.1 \
        || nvm install 12.18.1 \
        || _WSS_EXIT 1 "'nvm' function not functional after sourcing '~/.bash_profile'! Fix it yourself and re-run."
fi

if ! which node > /dev/null; then
    _WSS_EXIT 1 "'node' command not found! Install it yourself and re-run."
fi

################################################################################
_HEADING "Ensuring 'pinf.it' and other tools are installed."

pushd "${WSS_WORKSPACE_ROOT_PATH}/#!" > /dev/null
    if [ ! -e "npm-shrinkwrap.json" ] && [ -e "${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules" ]; then
        rm -Rf "${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules"
    fi
    if [ ! -e "${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules" ]; then
        if [ -e "npm-shrinkwrap.json" ]; then
            npm ci
        else
            npm install
            npm shrinkwrap
        fi
    fi
    if ! which pinf.it > /dev/null; then
        _WSS_EXIT 1 "'pinf.it' command not found! Something went wrong during the install. Delete '${WSS_WORKSPACE_ROOT_PATH}/#!/node_modules' and re-run."
    fi
popd > /dev/null


################################################################################
_HEADING "Act based on input arguments."

if [ ":$1" == ":--help" ]; then
    ################################################################################
    _HEADING "Display usage information."

    echo '
  Usage: run.sh [<Options>]

  <Options>:

      --reset <Aspect>        Where <Aspect> is one of:
                                w01      Workspace Level 01 (git)
'
else
    ################################################################################
    _HEADING "Run workspace instructions from './#!/#!inf.json' using 'pinf.it'."

    pushd "${WSS_WORKSPACE_ROOT_PATH}" > /dev/null

        pinf.it "./#!/#!workspace.inf.json" -- $@

    popd > /dev/null
fi
