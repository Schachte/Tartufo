import * as readline from "readline/promises";
import { Lexer, TokenType } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

// Theoretically, we would probably want to also add some notion of a RBRACE for function declarations and function assignments, etc.
const terminatingTokens = [TokenType.Semicolon];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  const messagePrompt = `
Experimental REPL - Used to debug AST output and interpreter output
for some use-cases. Not to be used.
----
(Interactive REPL v1.0)

`;
  console.log(messagePrompt);

  while (true) {
    let answer = await rl.question("> ");
    let lexer = new Lexer(answer);
    let tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const program = parser.parse();

    const interpreter = new Interpreter(program);
    interpreter.interpret();
  }
}

run();
