import * as readline from "readline/promises";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  const messagePrompt = `
──────▄▀▄─────▄▀▄
─────▄█░░▀▀▀▀▀░░█▄
─▄▄──█░░░░░░░░░░░█──▄▄
█▄▄█─█░░▀░░┬░░▀░░█─█▄▄█
-----------------------
--    TUFFIE LANG    --
-----------------------
(Interactive REPL v1.0)

  <ctrl> + c to exit

`;
  console.log(messagePrompt);

  while (1) {
    const answer = await rl.question("🐈 > ");
    const lexer = new Lexer(answer);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const program = parser.parse();

    const interpreter = new Interpreter(program);
    interpreter.interpret();
  }
}

run();
