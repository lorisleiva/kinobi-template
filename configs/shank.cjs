const path = require("path");
const { generateIdl } = require("@metaplex-foundation/shank-js");

const binaryInstallDir = path.join(__dirname, "..", ".crates");
const programDir = path.join(__dirname, "..", "program");

generateIdl({
  generator: "shank",
  programName: "acme_counter",
  programId: "MyProgram1111111111111111111111111111111111",
  idlDir: programDir,
  binaryInstallDir,
  programDir,
});
