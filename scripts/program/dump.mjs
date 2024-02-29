#!/usr/bin/env zx
import "zx/globals";
import {
  getExternalProgramAddresses,
  getExternalProgramOutputDir,
} from "../utils.mjs";

const addresses = getExternalProgramAddresses();
if (addresses.length === 0) exit(1);

const rpc = process.env.RPC ?? "https://api.mainnet-beta.solana.com";
const outputDir = getExternalProgramOutputDir();

echo(`Dumping external accounts to '${outputDir}':`);

await Promise.all(
  addresses.map(async (address) => {
    const binary = `${address}.so`;
    const hasBinary = await fs.exists(`${outputDir}/${binary}`);

    if (!hasBinary) {
      await copyFromChain(address, binary);
      echo(`Wrote account data to ${outputDir}/${binary}`);
      return;
    }

    await copyFromChain(address, `onchain-${binary}`);
    const [onChainHash, localHash] = await Promise.all([
      $`sha256sum -b ${outputDir}/onchain-${binary} | cut -d ' ' -f 1`.quiet(),
      $`sha256sum -b ${outputDir}/${binary} | cut -d ' ' -f 1`.quiet(),
    ]);

    if (onChainHash.toString() !== localHash.toString()) {
      echo(
        chalk.yellow("[ WARNING ]") +
          ` on-chain and local binaries are different for '${binary}'`
      );
    } else {
      echo(
        chalk.green("[ SKIPPED ]") +
          ` on-chain and local binaries are the same for '${binary}'`
      );
    }

    await $`rm ${outputDir}/onchain-${binary}`.quiet();
  })
);

async function copyFromChain(address, binary) {
  switch (binary.split(".").pop()) {
    case "bin":
      await $`solana account -u ${rpc} ${address} -o ${outputDir}/${binary} >/dev/null`.quiet();
      break;
    case "so":
      await $`solana program dump -u ${rpc} ${address} ${outputDir}/${binary} >/dev/null`.quiet();
      break;
    default:
      echo(chalk.red(`[  ERROR  ] unknown account type for '${binary}'`));
      exit(1);
      break;
  }
}
