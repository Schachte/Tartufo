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
      {
        type: TokenType.EOF,
      },
    ];
    expect(lexer.tokenize()).toStrictEqual(expectedTokens);
  });

  it("should handle single quoted strings", () => {
    const lexer = new Lexer("let myString = 'hello world';");
    const expectedTokens: Array<Token> = [
      {
        type: TokenType.Let,
        value: "let",
      },
      {
        type: TokenType.Symbol,
        value: "myString",
      },
      {
        type: TokenType.Eq,
        value: "=",
      },
      {
        type: TokenType.String,
        value: "hello world",
      },
      {
        type: TokenType.Semicolon,
        value: ";",
      },
      {
        type: TokenType.EOF,
      },
    ];
    const result = lexer.tokenize();
    expect(result).toStrictEqual(expectedTokens);
  });

  it("should handle double quoted strings", () => {
    const lexer = new Lexer('const banana = "hello mom2";');
    const expectedTokens: Array<Token> = [
      {
        type: TokenType.Const,
        value: "const",
      },
      {
        type: TokenType.Symbol,
        value: "banana",
      },
      {
        type: TokenType.Eq,
        value: "=",
      },
      {
        type: TokenType.String,
        value: "hello mom2",
      },
      {
        type: TokenType.Semicolon,
        value: ";",
      },
      {
        type: TokenType.EOF,
      },
    ];
    const result = lexer.tokenize();
    expect(result).toStrictEqual(expectedTokens);
  });

  it("fails when strings are unmatched", () => {
    const lexer = new Lexer('const banana = "hello mom;');
    const expectedTokens: Array<Token> = [
      {
        type: TokenType.Const,
        value: "const",
      },
      {
        type: TokenType.Symbol,
        value: "banana",
      },
      {
        type: TokenType.Eq,
        value: "=",
      },
      {
        type: TokenType.String,
        value: "hello mom",
      },
      {
        type: TokenType.Semicolon,
        value: ";",
      },
      {
        type: TokenType.EOF,
      },
    ];
    const result = () => lexer.tokenize();
    expect(result).toThrow(
      'missing matching end quote of type: """, but ' +
        'got ";" Maybe you forgot to close the value: "hello mom"'
    );
  });
});
