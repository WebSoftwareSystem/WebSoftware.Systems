#!/usr/bin/env bash

echo "[WSS:Workspace:02] Start booting shell workspace."

# TODO: Ensure CWD is at root of repo.

# TODO: Test requirements.

echo "[WSS:Workspace:02] Ensuring 'node' v12.13 using 'nvm'."

#nvm use 12.13

echo "[WSS:Workspace:02] Ensuring 'pinf.it' is installed."

if ! which pinf.it > /dev/null; then
    npm install -g @pinf-it/core@0.1.0-pre.0
fi

echo "[WSS:Workspace:02] Run workspace instructions from './#!/#!inf.json' using 'pinf.it'."

pinf.it ./
