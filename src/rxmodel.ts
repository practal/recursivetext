import { nat } from "things"
import { RX } from "./rx.js"

type Key = number

enum RxKind {
    block,
    line,
    character
} 

type RxModelBlock = {
    kind : RxKind.block,
    parent : Key,
    key : Key,
    first : RxModelLine,
    rest : (RxModelLine | RxModelBlock)[]
}

type RxModelLine = {
    kind : RxKind.line,
    parent : Key,
    index : nat,
    key : Key,
    characters : RxModelCharacter[]
}

type RxModelCharacter = {
    kind : RxKind.character,
    key : Key,
    character : string
}

type RxEntity = RxModelBlock | RxModelLine | RxModelCharacter

class RxModelDocument {
    #key : Key
    #lastKey : Key
    #blocks : RxModelBlock[]
    #entities : Map<Key, RxEntity>

    constructor(rx : RX<any, any, any>, document : any) {
        this.#key = 0;
        this.#lastKey = 0;
        this.#blocks = [];
        this.#entities = new Map();
        this.#loadDocument(rx, document);
    }

    #newKey() : Key {
        return ++this.#lastKey;
    }

    #loadDocument<D, B, L>(rx : RX<D, B, L>, document : D) {
        this.#blocks = [];
        for (const block of rx.fromDocument(document)) {
            this.#blocks.push(this.#loadBlock(rx, block, this.#key));
        }
    }

    #loadBlock<D, B, L>(rx : RX<D, B, L>, block : B, parent : Key) : RxModelBlock {
        throw new Error();
    }

}
