import { readDocument, writeDocument, simpleRX } from "./index.js";

const plaintext = "..."; // some text you obtained from somewhere

// Read RX from plain text
const rx = readDocument(simpleRX, plaintext);

// Write RX as plain text
const saved_as_plaintext = writeDocument(simpleRX, rx); 