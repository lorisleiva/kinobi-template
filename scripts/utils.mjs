import "zx/globals";
import { parse as parseToml } from "@iarna/toml";

const workingDirectory = (await $`pwd`.quiet()).toString().trim();

export function getAllProgramIdls() {
  return getAllProgramFolders().map((folder) =>
    path.join(workingDirectory, folder, "idl.json")
  );
}

export function getExternalProgramOutputDir() {
  const config =
    getCargo().workspace?.metadata?.solana?.["external-programs-output"];
  return path.join(workingDirectory, config ?? "target/deploy");
}

export function getExternalProgramAddresses() {
  const addresses = getProgramFolders().flatMap(
    (folder) =>
      getCargo(folder).package?.metadata?.solana?.["program-dependencies"] ?? []
  );
  return Array.from(new Set(addresses));
}

export function getProgramFolders() {
  return process.env.PROGRAMS
    ? process.env.PROGRAMS.split(/\s+/)
    : getAllProgramFolders();
}

export function getAllProgramFolders() {
  return getCargo().workspace.members.filter((member) =>
    (getCargo(member).lib?.["crate-type"] ?? []).includes("cdylib")
  );
}

export function getCargo(folder) {
  return parseToml(
    fs.readFileSync(
      path.join(workingDirectory, folder ? folder : ".", "Cargo.toml"),
      "utf8"
    )
  );
}
