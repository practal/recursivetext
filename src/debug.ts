import { readDocument, writeDocument, simpleRX, simpleAndSafeRX } from "./index.js";

export const bug = `    block
        block2
            block3
                block4
                    block5
                        block6
                            block7
                                block8
                                weird
                                    block9
                                        block10
                                            block11`;

// Read RX from plain text
const rx = readDocument(simpleAndSafeRX, bug);

console.log(writeDocument(simpleAndSafeRX, rx));
