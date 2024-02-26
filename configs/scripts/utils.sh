#!/bin/bash

# Export the working directory.
cd $(dirname $(dirname $(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)))
export WORKING_DIR=$(pwd)

# Export variables.
export PROGRAMS_OUTPUT_DIR=${WORKING_DIR}/${PROGRAMS_OUTPUT}
export PROGRAMS_EXTERNAL_ADDRESSES_ARRAY=($PROGRAMS_EXTERNAL_ADDRESSES)
export PROGRAMS_EXTERNAL_BINARIES_ARRAY=($PROGRAMS_EXTERNAL_BINARIES)

# Colour output helpers.
RED() { echo $'\e[1;31m'$1$'\e[0m'; }
GRN() { echo $'\e[1;32m'$1$'\e[0m'; }
YLW() { echo $'\e[1;33m'$1$'\e[0m'; }
