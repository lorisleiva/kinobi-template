const path = require("path");
const { readFileSync } = require("fs");
const { parse: parseToml } = require("@iarna/toml");

module.exports = {
  getExternalProgramOutputDir,
  getExternalProgramAddresses,
  getProgramFolders,
  getAllProgramFolders,
  getCargo,
};

function getExternalProgramOutputDir() {
  const config =
    getCargo().workspace?.metadata?.solana?.["external-programs-output"];
  return path.join(__dirname, "..", config ?? "target/deploy");
}

function getExternalProgramAddresses() {
  const addresses = getProgramFolders().flatMap(
    (folder) =>
      getCargo(folder).package?.metadata?.solana?.["program-dependencies"] ?? []
  );
  return Array.from(new Set(addresses));
}

function getProgramFolders() {
  return process.env.PROGRAMS
    ? process.env.PROGRAMS.split(/\s+/)
    : getAllProgramFolders();
}

function getAllProgramFolders() {
  return getCargo().workspace.members.filter((member) =>
    (getCargo(member).lib?.["crate-type"] ?? []).includes("cdylib")
  );
}

function getCargo(folder) {
  return parseToml(
    readFileSync(
      path.join(__dirname, "..", folder ? folder : ".", "Cargo.toml"),
      "utf8"
    )
  );
}
