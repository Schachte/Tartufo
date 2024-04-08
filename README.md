# TuffieLang

WIP interpreter for a dynamic scripting language built using Typescript to play around with lexers and parsers.

## Tests
`npm run test`

## Usage

```ts
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
```

## Output

```
AST: {
  "type": "LetStatement",
  "identifier": "hello",
  "expression": {
    "type": "NumberExpression",
    "literal": 2
  }
}
Serialized output: let hello = 2;

AST: {
  "type": "LetStatement",
  "identifier": "test",
  "expression": {
    "type": "StringExpression",
    "literal": "sup"
  }
}
Serialized output: let test = sup;
```