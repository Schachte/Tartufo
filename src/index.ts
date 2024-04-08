import { Lexer } from "./lexer";

const sourceCode = `const 
letter const let letter let - -- === my_data = 5  ==   _ *  2; const;
hi`;

const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();
