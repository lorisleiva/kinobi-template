const path = require("path");
const fs = require("fs");

module.exports = {
  validator: {
    commitment: "processed",
    programs: [...getPrograms(), ...getExternalPrograms()],
  },
};

function getPrograms() {
  const folders = process.env.PROGRAMS.split(/\s+/);
  const addresses = process.env.PROGRAMS_ADDRESSES.split(/\s+/);
  const binaryDir = path.join(__dirname, "..", "target", "deploy");
  return folders.map((folder, index) => {
    const cargoFile = fs.readFileSync(
      path.join(__dirname, "..", folder, "Cargo.toml"),
      "utf8"
    );
    const name = cargoFile.match(/name = "([^"]+)"/)[1].replace(/-/g, "_");
    const binary = `${name}.so`;
    return {
      label: name,
      programId: addresses[index],
      deployPath: path.join(binaryDir, binary),
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
