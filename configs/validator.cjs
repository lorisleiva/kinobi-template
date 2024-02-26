const path = require("path");

module.exports = {
  validator: {
    commitment: "processed",
    programs: [
      ...getExternalPrograms(),
      {
        label: "Counter",
        programId: "MyProgram1111111111111111111111111111111111",
        deployPath: getProgram("acme_counter.so"),
      },
    ],
  },
};

function getProgram(programBinary) {
  return path.join(__dirname, "..", process.env.PROGRAMS_OUTPUT, programBinary);
}

function getExternalPrograms() {
  const addresses = process.env.PROGRAMS_EXTERNAL_ADDRESSES.split(/\s+/);
  const binaries = process.env.PROGRAMS_EXTERNAL_BINARIES.split(/\s+/);
  return addresses.map((address, index) => {
    const binary = binaries[index];
    return {
      label: binary.replace(/\.so$/, ""),
      programId: address,
      deployPath: getProgram(binary),
    };
  });
}
