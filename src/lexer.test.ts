import { Lexer, Token, TokenType } from "./lexer";

describe("lexer performining tokenization", () => {
  it("should tokenize arithmetic operations", () => {
    const lexer = new Lexer("2 + 5");
    const expectedTokens: Array<Token> = [
      {
        type: TokenType.Number,
        value: "2",
      },
      {
        type: TokenType.Add,
        value: "+",
      },
      {
        type: TokenType.Number,
        value: "5",
      },
    ];
    expect(lexer.tokenize()).toStrictEqual(expectedTokens);
  });
});
