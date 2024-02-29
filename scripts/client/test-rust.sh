#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Start the local validator.
(cd ${WORKING_DIR} && pnpm validator)

# Run the tests.
cd ${WORKING_DIR}/clients/rust
if [ ! "$(command -v $SOL_FORMATTER)" = "" ]; then
    CARGO_TERM_COLOR=always cargo test-sbf $* 2>&1 | ${SOL_FORMATTER}
else
    cargo test-sbf $*
fi
