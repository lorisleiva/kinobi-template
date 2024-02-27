#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Save external programs binaries to the output directory.
source ${SCRIPT_DIR}/dump.sh

# Go to the working directory.
cd $WORKING_DIR

if [ ! -z "$PROGRAM" ]; then
    PROGRAMS=$PROGRAM
fi

# Get all command-line arguments.
ARGS=$*

# command-line arguments override env variable
if [ ! -z "$ARGS" ]; then
    PROGRAMS=$1
    shift
    ARGS=$*
fi

WORKING_DIR=$(pwd)
SOLFMT="solfmt"

for p in ${PROGRAMS[@]}; do
    cd ${WORKING_DIR}/programs/${p}

    if [ ! "$(command -v $SOLFMT)" = "" ]; then
        CARGO_TERM_COLOR=always cargo test-sbf ${ARGS} 2>&1 | ${SOLFMT}
    else
        RUST_LOG=error cargo test-sbf ${ARGS}
    fi
done
