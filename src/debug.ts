import { readDocument, writeDocument, simpleAndSafeRX } from "./index.js";

const plaintext = "..."; // some text you obtained from somewhere

// Read RX from plain text
const rx = readDocument(simpleAndSafeRX, plaintext);

// Write RX as plain text
const saved_as_plaintext = writeDocument(simpleAndSafeRX, rx); 