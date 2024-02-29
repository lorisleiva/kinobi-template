const path = require("path");
const {
  getCargo,
  getExternalProgramAddresses,
  getExternalProgramOutputDir,
  getProgramFolders,
} = require("./utils.cjs");

module.exports = {
  validator: {
    commitment: "processed",
    programs: [...getPrograms(), ...getExternalPrograms()],
  },
};

function getPrograms() {
  const binaryDir = path.join(__dirname, "..", "target", "deploy");
  return getProgramFolders().map((folder) => {
    const cargo = getCargo(folder);
    const name = cargo.package.name.replace(/-/g, "_");
    return {
      label: name,
      programId: cargo.package.metadata.solana["program-id"],
      deployPath: path.join(binaryDir, `${name}.so`),
    };
  });
}

function getExternalPrograms() {
  const binaryDir = getExternalProgramOutputDir();
  return getExternalProgramAddresses().map((address) => ({
    label: address,
    programId: address,
    deployPath: path.join(binaryDir, `${address}.so`),
  }));
}
