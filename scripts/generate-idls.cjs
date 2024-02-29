#!/usr/bin/env node

const path = require("path");
const { generateIdl } = require("@metaplex-foundation/shank-js");
const { getCargo, getProgramFolders } = require("./utils.cjs");

const binaryInstallDir = path.join(__dirname, "..", ".cargo");

getProgramFolders().forEach((folder) => {
  const cargo = getCargo(folder);
  const isShank = Object.keys(cargo.dependencies).includes("shank");
  const programDir = path.join(__dirname, "..", folder);

  generateIdl({
    generator: isShank ? "shank" : "anchor",
    programName: cargo.package.name.replace(/-/g, "_"),
    programId: cargo.package.metadata.solana["program-id"],
    idlDir: programDir,
    idlName: "idl",
    programDir,
    binaryInstallDir,
  });
});
