import { Relation, Test, assertEqT, assertT, configureDebugging, runTests } from "things";
import { RX, SafeRX, compareDocuments, displayDocument, readDocument, simpleAndSafeRX, simpleRX, writeDocument } from "./rx.js";
import { assertCrashT } from "things";

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

export function createExampleDocument<D, B, L>(rx : RX<D, B, L>, index : number = 0) : D {

    function block(...items : (L | B)[]) : B {
        return rx.block(...items);
    }
    function line(text? : string) : L {
        return rx.line(text);
    }
    function paragraph(s : string) : B {
        return rx.block(rx.line(s));
    }

    switch(index) {
        case 0:
            return rx.document(
                block( // comment block
                line("% This is a comment."),
                line("This is the second line of the comment."),
                line("And here is the third one.")
                ),
                block( // theorem 
                    line("theorem Modus-Ponens: B"),
                    paragraph("premise: implies(A, B)"),
                    paragraph("premise: A")
                ),
                block(
                    line("theorem Universal-Introduction:"),
                    paragraph("for-all(x. A[x])"),
                    paragraph("premise: x. A[x]")
                ),
                block(
                    line("theorem Truth-1: true")
                ),
                block(
                    line("theorem Truth-2: implies(A, equals(A, true))")
                ),
                block(
                    line("theorem Implication-1: implies(A, implies(B, A))")
                ),
                block(
                    line("theorem Implication-2:"),
                    block(
                        line("implies"),
                        paragraph("implies(A, implies(B, C))"),
                        paragraph("implies(implies(A, B), implies(B, C))")
                    )
                ),
                block(
                    line("theorem Universal-1: implies(for-all(x. A[x]), A[x])"),
                ),
                block(
                    line("theorem Universal-2:"),
                    block(
                        line("implies"),
                        paragraph("for-all(x. implies(A, B[x]))"),
                        paragraph("implies(A, for-all(x. B[x]))")
                    )
                ),
                paragraph("theorem Equality-1: equals(x, x)"),
                paragraph("theorem Equality-2: implies(equals(x, y), implies(A[x], A[y]))")
            );
        case 1:
            return rx.document(block(block()));
        case 2:
            return rx.document(block(block(line("Hello"), line(" World"))));
        case 3:
            return rx.document(block(block(line(""))));
        case 4:
            return rx.document(block(line(), block(line())));   
        case 5:
            return rx.document(); 
        case 6:
            return rx.document(
                paragraph("Here is a simple list of items:"),
                block(
                    paragraph("item 1"),
                    paragraph("item 2"),
                    paragraph("item 3"))
            );
        case 7:
            return rx.document(
                paragraph("Here is a simple list of items:"),
                block(
                    line("Some line"),
                    paragraph("item 1"),
                    paragraph("item 2"),
                    paragraph("item 3"))
            );    
        case 8:
            return rx.document(
                paragraph("Here is a simple list of items:"),
                block(
                    line(""),
                    paragraph("item 1"),
                    paragraph("item 2"),
                    paragraph("item 3"))
            );    
        case 9:
            return rx.document(
                block(
                    paragraph("item 1"),
                    paragraph("item 2"),
                    paragraph("item 3")),
                block(
                    paragraph("item 4"),
                    paragraph("item 5"),
                    paragraph("item 6"))
            );
        case 10:
            return rx.document(
                block(
                    line(),
                    paragraph("item 1"),
                    paragraph("item 2"),
                    paragraph("item 3")),
                block(
                    line(),
                    paragraph("item 4"),
                    paragraph("item 5"),
                    paragraph("item 6"))
            );
        case 11: 
            return rx.document(
                paragraph(" hello"),
                paragraph("world")
            );
        case 12:
            return rx.document(
                paragraph("\xA0hello")
            );
        case 13:
            return rx.document(
                paragraph("hello\n")
            )
        case 14:
            return rx.document(
                paragraph("hello\r")
            )
        default: throw new Error("Unknow example index");
    }
}

function testReadWrite<D, B, L>(rx : RX<D, B, L>, doc : D) {
    assertT(compareDocuments(rx, doc, doc) === Relation.EQUAL);
    const text = writeDocument(rx, doc);
    const parsed_doc = readDocument(rx, text);
    assertT(compareDocuments(rx, doc, parsed_doc) === Relation.EQUAL);
}

function examineReadWrite<D, B, L>(rx : RX<D, B, L>, doc : D) {
    console.log("-------------- original document");
    displayDocument(rx, doc);
    console.log("-------------- as text");
    const text = writeDocument(rx, doc)
    console.log(text.replaceAll(" ", "␣"));
    console.log("------------- document parsed from text");
    const parsed_doc = readDocument(rx, text);
    displayDocument(rx, parsed_doc);
    console.log("------------- original === parsed: ", 
        compareDocuments(rx, doc, parsed_doc) === Relation.EQUAL);
}

// Valid Examples
for (const index of [0, 4, 7, 8, 10, 11]) {
    Test(() => {
        testReadWrite(simpleRX, createExampleDocument(simpleRX, index));
    }, `Valid RX Example ${index}`);
}

// Invalid Examples
for (const index of [1, 2, 3, 5, 6, 9, 12, 13, 14]) {
    Test(() => {
        assertCrashT(() => createExampleDocument(simpleRX, index));
    }, `Invalid RX Example ${index}`);
}

// All Examples, made safe
for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
    Test(() => {
        let rx = simpleAndSafeRX;
        testReadWrite(rx, createExampleDocument(rx, index));
    }, `Safe RX Example ${index}`);
}

Test(() => {
    let text = "";
    const doc = readDocument(simpleRX, text);
    let text2 = writeDocument(simpleRX, doc);
    assertEqT(text, text2);
    testReadWrite(simpleRX, doc);
}, "Empty Text <-> Document");

function callback(err : any) {
    console.log("File has been written! err = " + err);
}

Test(() => {
    assertCrashT(() => readDocument(simpleRX, bug));
}, "Bug");


//writeFile("/Users/stevenobua/Repositories/parlay/playground/zero.txt", "Hey th\0\0\u0000\u0001\u0002\u001bere!", "utf8", callback);

//examineReadWrite(simpleRX, createExampleDocument(simpleRX, 6));

configureDebugging(console.log);
runTests();