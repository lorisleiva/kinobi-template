const path = require("path");

module.exports = {
  validator: {
    commitment: "processed",
    programs: [...getPrograms(), ...getExternalPrograms()],
  },
};

function getPrograms() {
  const addresses = process.env.PROGRAMS_ADDRESSES.split(/\s+/);
  const binaries = process.env.PROGRAMS_BINARIES.split(/\s+/);
  const binaryDir = path.join(__dirname, "..", "target", "deploy");
  return addresses.map((address, index) => ({
    label: binaries[index].replace(/\.so$/, ""),
    programId: address,
    deployPath: path.join(binaryDir, binaries[index]),
  }));
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
