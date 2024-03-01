#!/usr/bin/env zx
import "zx/globals";
import { startValidator, stopValidator, workingDirectory } from "../utils.mjs";

// Start the local validator.
await startValidator();

// Run the tests.
cd(path.join(workingDirectory, "clients", "rust"));
const hasSolfmt = await which("solfmt", { nothrow: true });
if (hasSolfmt) {
  await $`cargo test-sbf ${argv._} 2>&1 | solfmt`;
} else {
  await $`cargo test-sbf ${argv._}`;
}

// Stop the local validator.
await stopValidator();
