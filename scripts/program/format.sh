#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Format the programs.
for p in ${PROGRAMS[@]}; do
    if [ -d ${WORKING_DIR}/${p} ]; then
        cd ${WORKING_DIR}/${p}
        cargo fmt $*
    else
        echo $(YLW "Program not found: ${WORKING_DIR}/${p}")
    fi
done
