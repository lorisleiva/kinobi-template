#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Go to the Rust client directory.
cd ${WORKING_DIR}/clients/rust

# Get the command-line arguments and set some variables.
SOLFMT="solfmt"

# Run the tests.
if [ ! "$(command -v $SOLFMT)" = "" ]; then
    CARGO_TERM_COLOR=always cargo test-sbf --sbf-out-dir ${PROGRAMS_OUTPUT_DIR} $* 2>&1 | ${SOLFMT}
else
    cargo test-sbf --sbf-out-dir ${PROGRAMS_OUTPUT_DIR} $*
fi
