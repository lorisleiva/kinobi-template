#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Start the local validator.
(cd ${WORKING_DIR} && pnpm validator)

# Build the client and run the tests.
cd ${WORKING_DIR}/clients/js
pnpm install && pnpm build && pnpm test $*
