# [Recursive teXt](http://recursivetext.com)

See [recursivetext.com](http://recursivetext.com) for information on ***Recursive teXt***.

Install with npm:
```
npm install recursivetext
```

Usage:
```
import { readDocument, writeDocument, simpleRX } from "recursivetext";

const plaintext = "..."; // some text you obtained from somewhere

// Read RX from plain text
const rx = readDocument(simpleRX, plaintext);

// Write RX as plain text
const saved_as_plaintext = writeDocument(simpleRX, rx); 
```