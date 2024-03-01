#!/usr/bin/env zx
import "zx/globals";
import { startValidator, stopValidator, workingDirectory } from "../utils.mjs";

// Start the local validator.
await startValidator();

// Build the client and run the tests.
cd(path.join(workingDirectory, "clients", "js"));
await $`pnpm install`;
await $`pnpm build`;
await $`pnpm test ${argv._}`;

// Stop the local validator.
await stopValidator();
