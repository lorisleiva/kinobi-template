#!/bin/bash

# Import utils.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
source $(dirname $SCRIPT_DIR)/utils.sh

# Go to the working directory.
cd $WORKING_DIR

# Set default value for RPC option.
if [ -z ${RPC+x} ]; then
    RPC="https://api.mainnet-beta.solana.com"
fi

# Create the output directory if it doesn't exist.
if [ ! -d ${PROGRAMS_EXTERNAL_OUTPUT} ]; then
    mkdir ${PROGRAMS_EXTERNAL_OUTPUT}
fi

# Print prologue message if we have external programs.
if [ ${#PROGRAMS_EXTERNAL_ADDRESSES[@]} -gt 0 ]; then
    echo "Dumping external accounts to '${PROGRAMS_EXTERNAL_OUTPUT}':"
fi

# Helper function to copy external programs or accounts binaries from the chain.
copy_from_chain() {
    ACCOUNT_TYPE=$(echo $2 | cut -d. -f2)
    PREFIX=$3

    case "$ACCOUNT_TYPE" in
    "bin")
        solana account -u $RPC $1 -o ${PROGRAMS_EXTERNAL_OUTPUT}/$3$2 >/dev/null
        ;;
    "so")
        solana program dump -u $RPC $1 ${PROGRAMS_EXTERNAL_OUTPUT}/$3$2 >/dev/null
        ;;
    *)
        echo $(RED "[  ERROR  ] unknown account type for '$2'")
        exit 1
        ;;
    esac

    if [ -z "$PREFIX" ]; then
        echo "Wrote account data to ${PROGRAMS_EXTERNAL_OUTPUT}/$3$2"
    fi
}

# Dump external programs binaries if needed.
for ADDRESS in ${PROGRAMS_EXTERNAL_ADDRESSES[@]}; do
    BINARY=${ADDRESS}.so

    if [ ! -f "${PROGRAMS_EXTERNAL_OUTPUT}/${BINARY}" ]; then
        copy_from_chain "${ADDRESS}" "${BINARY}"
    else
        copy_from_chain "${ADDRESS}" "${BINARY}" "onchain-"

        ON_CHAIN=$(sha256sum -b ${PROGRAMS_EXTERNAL_OUTPUT}/onchain-${BINARY} | cut -d ' ' -f 1)
        LOCAL=$(sha256sum -b ${PROGRAMS_EXTERNAL_OUTPUT}/${BINARY} | cut -d ' ' -f 1)

        if [ "$ON_CHAIN" != "$LOCAL" ]; then
            echo $(YLW "[ WARNING ] on-chain and local binaries are different for '${BINARY}'")
        else
            echo "$(GRN "[ SKIPPED ]") on-chain and local binaries are the same for '${BINARY}'"
        fi

        rm ${PROGRAMS_EXTERNAL_OUTPUT}/onchain-${BINARY}
    fi
done

# Print epilogue message if we have external programs.
if [ ${#PROGRAMS_EXTERNAL_ADDRESSES[@]} -gt 0 ]; then
    echo ""
fi
