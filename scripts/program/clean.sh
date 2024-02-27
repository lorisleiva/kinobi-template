#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Go to the working directory.
cd $WORKING_DIR

# Remove the programs output directory.
rm -rf $PROGRAMS_EXTERNAL_OUTPUT_DIR
rm -rf target
