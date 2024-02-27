#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Go to the JS client directory.
cd ${WORKING_DIR}/clients/js

# Build the client and run the tests.
pnpm install && pnpm build && pnpm test $*
