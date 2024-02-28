const path = require("path");
const fs = require("fs");
const TOML = require("@iarna/toml");

module.exports = {
  validator: {
    commitment: "processed",
    programs: [...getPrograms(), ...getExternalPrograms()],
  },
};

function getPrograms() {
  const folders = process.env.PROGRAMS.split(/\s+/);
  const binaryDir = path.join(__dirname, "..", "target", "deploy");
  return folders.map((folder) => {
    const cargo = TOML.parse(
      fs.readFileSync(path.join(__dirname, "..", folder, "Cargo.toml"), "utf8")
    );
    const name = cargo.package.name.replace(/-/g, "_");
    return {
      label: name,
      programId: cargo.package.metadata.solana["program-id"],
      deployPath: path.join(binaryDir, `${name}.so`),
    };
  });
}

function getExternalPrograms() {
  const addresses = process.env.PROGRAMS_EXTERNAL_ADDRESSES.split(/\s+/);
  const binaryDir = path.join(
    __dirname,
    "..",
    process.env.PROGRAMS_EXTERNAL_OUTPUT
  );
  return addresses.map((address) => ({
    label: address,
    programId: address,
    deployPath: path.join(binaryDir, `${address}.so`),
  }));
}
