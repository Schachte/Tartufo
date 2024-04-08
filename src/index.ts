import { Lexer } from "./lexer";
import { Parser } from "./parser";

const sourceCode = `
let hello = 2; 
let test = 'sup';
`;

const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const program = parser.parse();

for (const node of program.body) {
  console.log(
    `AST: ${JSON.stringify(node, null, 2)}\nSerialized output: ${
      node.debug && node.debug()
    }\n`
  );
}
