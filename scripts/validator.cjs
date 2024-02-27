const path = require("path");

module.exports = {
  validator: {
    commitment: "processed",
    programs: getAllPrograms(),
  },
};

function getAllPrograms() {
  const addresses = `${process.env.PROGRAMS_ADDRESSES} ${process.env.PROGRAMS_EXTERNAL_ADDRESSES}`;
  const binaries = `${process.env.PROGRAMS_BINARIES} ${process.env.PROGRAMS_EXTERNAL_BINARIES}`;
  const binariesArray = binaries.split(/\s+/);
  return addresses.split(/\s+/).map((address, index) => {
    const binary = binariesArray[index];
    return {
      label: binary.replace(/\.so$/, ""),
      programId: address,
      deployPath: getBinaryPath(binary),
    };
  });
}

function getBinaryPath(programBinary) {
  return path.join(__dirname, "..", process.env.PROGRAMS_OUTPUT, programBinary);
}
