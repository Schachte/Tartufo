import { tokenize } from "./lexer";

const tokens = tokenize(`const 
letter const let letter let - -- === my_data = 5  ==   _ *  2; const;
hi
`);
console.log(tokens);
