#!/bin/bash

# Export the working directory.
cd $(dirname $(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd))
export WORKING_DIR=$(pwd)

# Colour output helpers.
RED() { echo $'\e[1;31m'$1$'\e[0m'; }
GRN() { echo $'\e[1;32m'$1$'\e[0m'; }
YLW() { echo $'\e[1;33m'$1$'\e[0m'; }
CYN() { echo $'\e[1;36m'$1$'\e[0m'; }

# Set global environment variables.
CARGO_TERM_COLOR=always
SOL_FORMATTER="solfmt"

# TOML parser that installs and delegates to the tomato-toml CLI.
toml() {
  if [ ! -f $WORKING_DIR/.cargo/bin/tomato ]; then
    echo ""
    echo $(CYN "Installing tomato-toml to get information from Cargo.toml files...")
    cargo install tomato-toml --bins --root .cargo
  fi
  $WORKING_DIR/.cargo/bin/tomato $*
}

# Get the workspace members and identify the programs by checking if they are cdylibs.
eval "WORKSPACE_MEMBERS=$(toml get workspace.members $WORKING_DIR/Cargo.toml -f bash)"
eval "ALL_PROGRAMS=$(toml get workspace.members $WORKING_DIR/Cargo.toml -f bash)"
for i in "${!ALL_PROGRAMS[@]}"; do
  if [ ! -f $WORKING_DIR/${ALL_PROGRAMS[$i]}/Cargo.toml ] || [[ ! "$(toml get lib.crate-type $WORKING_DIR/${ALL_PROGRAMS[$i]}/Cargo.toml)" =~ cdylib ]]; then
    unset -v 'ALL_PROGRAMS[$i]'
  fi
done

# Get the user-defined programs or use all programs.
if [ -z "$PROGRAMS" ]; then
  PROGRAMS=("${ALL_PROGRAMS[@]}")
else
  PROGRAMS=($PROGRAMS)
fi

# Get the program addresses.
PROGRAMS_ADDRESSES=()
for p in "${PROGRAMS[@]}"; do
  if [ -f $WORKING_DIR/$p/Cargo.toml ]; then
    eval "a=$(toml get package.metadata.solana.program-id $WORKING_DIR/$p/Cargo.toml -f bash)"
    PROGRAMS_ADDRESSES+=($a)
  fi
done

# Get the addresses of program dependencies.
PROGRAMS_EXTERNAL_ADDRESSES=()
for p in "${PROGRAMS[@]}"; do
  if [ -f $WORKING_DIR/$p/Cargo.toml ]; then
    eval "addresses=$(toml get package.metadata.solana.program-dependencies $WORKING_DIR/$p/Cargo.toml -f bash)"
    for a in "${addresses[@]}"; do
      PROGRAMS_EXTERNAL_ADDRESSES+=($a)
    done
  fi
done
OLDIFS="$IFS"
IFS=$'\n'
PROGRAMS_EXTERNAL_ADDRESSES=($(printf "%s\n" "${PROGRAMS_EXTERNAL_ADDRESSES[@]}" | sort -du))
IFS="$OLDIFS"

# Get the output directory for external programs.
PROGRAMS_EXTERNAL_OUTPUT_CONFIG=$(toml get workspace.metadata.solana.external-programs-output $WORKING_DIR/Cargo.toml)
if [ -z "$PROGRAMS_EXTERNAL_OUTPUT_CONFIG" ]; then
  PROGRAMS_EXTERNAL_OUTPUT=${WORKING_DIR}/target/deploy
else
  PROGRAMS_EXTERNAL_OUTPUT=${WORKING_DIR}/${PROGRAMS_EXTERNAL_OUTPUT_CONFIG}
fi
