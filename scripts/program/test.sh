#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Save external programs binaries to the output directory.
source ${SCRIPT_DIR}/dump.sh

# Test the programs.
SOLFMT="solfmt"
for p in ${PROGRAMS[@]}; do
    if [ -d ${WORKING_DIR}/${p} ]; then
        cd ${WORKING_DIR}/${p}
        if [ ! "$(command -v $SOLFMT)" = "" ]; then
            RUST_LOG=error cargo test-sbf $* 2>&1 | ${SOLFMT}
        else
            RUST_LOG=error cargo test-sbf $*
        fi
    else
        echo $(YLW "Program not found: ${WORKING_DIR}/${p}")
    fi
done
