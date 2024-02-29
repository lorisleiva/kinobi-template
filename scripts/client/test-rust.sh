#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Go to the Rust client directory.
cd ${WORKING_DIR}/clients/rust

# Run the tests.
if [ ! "$(command -v $SOL_FORMATTER)" = "" ]; then
    CARGO_TERM_COLOR=always cargo test-sbf $* 2>&1 | ${SOL_FORMATTER}
else
    cargo test-sbf $*
fi
