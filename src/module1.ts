import { hello2 } from "./module2.js";

export function hello1() : string {
    return hello2();
}