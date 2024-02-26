const path = require("path");
const k = require("@metaplex-foundation/kinobi");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const programDir = path.join(__dirname, "..", "program");

// Instanciate Kinobi.
const kinobi = k.createFromIdls([path.join(programDir, "acme_counter.json")]);

// Update instructions.
kinobi.update(
  k.updateInstructionsVisitor({
    create: {
      byteDeltas: [k.instructionByteDeltaNode(k.accountLinkNode("counter"))],
    },
  })
);

// Set ShankAccount discriminator.
const key = (name) => ({ field: "key", value: k.enumValueNode("Key", name) });
kinobi.update(
  k.setAccountDiscriminatorFromFieldVisitor({
    counter: key("counter"),
  })
);

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
const prettier = require(path.join(clientDir, "js", ".prettierrc.json"));
kinobi.accept(k.renderJavaScriptExperimentalVisitor(jsDir, { prettier }));

// Render Rust.
const crateDir = path.join(clientDir, "rust");
const rustDir = path.join(clientDir, "rust", "src", "generated");
kinobi.accept(
  k.renderRustVisitor(rustDir, { formatCode: true, crateFolder: crateDir })
);
