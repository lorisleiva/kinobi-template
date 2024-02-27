#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Save external programs binaries to the output directory.
source ${SCRIPT_DIR}/dump.sh

# Build the programs.
for p in ${PROGRAMS[@]}; do
    if [ -d ${WORKING_DIR}/${p} ]; then
        cd ${WORKING_DIR}/${p}
        cargo build-sbf $*
    else
        echo $(YLW "Program not found at: ${WORKING_DIR}/${p}.")
    fi
done
