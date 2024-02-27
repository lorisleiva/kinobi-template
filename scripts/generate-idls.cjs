const path = require("path");
const fs = require("fs");
const { generateIdl } = require("@metaplex-foundation/shank-js");

const binaryInstallDir = path.join(__dirname, "..", ".cargo");

getPrograms().forEach((program) => {
  generateIdl({
    generator: program.generator,
    programName: program.name,
    programId: program.address,
    idlDir: program.programDir,
    programDir: program.programDir,
    binaryInstallDir,
  });
});

function getPrograms() {
  const folders = process.env.PROGRAMS.split(/\s+/);
  const addresses = process.env.PROGRAMS_ADDRESSES.split(/\s+/);
  return folders.map((folder, index) => {
    const cargoFile = fs.readFileSync(
      path.join(__dirname, "..", folder, "Cargo.toml"),
      "utf8"
    );
    const name = cargoFile.match(/name = "([^"]+)"/)[1].replace(/-/g, "_");
    const binary = `${name}.so`;
    const isShank = cargoFile.match(/shank/);
    return {
      folder,
      programDir: path.join(__dirname, "..", folder),
      address: addresses[index],
      binary: binary,
      name: name,
      isShank,
      generator: isShank ? "shank" : "anchor",
    };
  });
}
