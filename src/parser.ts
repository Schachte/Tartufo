import { Token, TokenType } from "./lexer";

type expressionType = "BinaryExpression" | "NumberExpression";
type statementType =
  | "IfStatement"
  | "LetStatement"
  | "ConstStatement"
  | "ExpressionStatement";

export interface Program extends Node {
  type: "Program";
  body: Statement[];
}

export interface Node {
  type: expressionType | statementType | "Program";
  toString(): string;
}

export interface Expression extends Node {
  type: expressionType;
}

export interface Statement extends Node {
  type: statementType;
  expression: Expression | Expression[];
}

export interface LetStatement extends Statement {
  type: statementType;
  expression: Expression;
  identifier: string;
}

export interface NumberExpression extends Expression {
  type: expressionType;
  literal: Number;
}

export class Parser {
  private tokens: Array<Token>;
  private statements: Array<Statement>;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.statements = new Array<Statement>();
  }

  parseNumberExpression(): NumberExpression {
    return {
      type: "NumberExpression",
      literal: parseInt(this.consumeCurrentToken().value),
    };
  }

  parseExpression(): Expression | any {
    switch (this.getCurrentToken().type) {
      case TokenType.Number:
        return this.parseNumberExpression();
    }
  }

  parseLetStatement(): LetStatement {
    const expectedSymbol = this.consumeCurrentToken();
    if (!expectedSymbol || expectedSymbol.type != TokenType.Symbol) {
      throw new Error(
        `invalid let statement. Expected ${TokenType.Symbol} and got ${expectedSymbol.type}`
      );
    }

    const expectedEq = this.consumeCurrentToken();
    if (!expectedEq || expectedEq.type != TokenType.Eq) {
      throw new Error(
        `invalid let statement. Expected ${TokenType.Eq} and got ${expectedSymbol.type}`
      );
    }

    const expression = this.parseExpression();
    const expectedEndOfExpression = this.consumeCurrentToken();
    if (
      !expectedEndOfExpression ||
      expectedEndOfExpression.type != TokenType.Semicolon
    ) {
      throw new Error(
        `invalid let statement. Expected ${TokenType.Semicolon} and got ${expectedSymbol.type}`
      );
    }

    return {
      type: "LetStatement",
      identifier: expectedSymbol.value,
      expression,
      toString: (): string => {
        return `let ${expectedSymbol.value} = ${expression.toString()};`;
      },
    };
  }

  parseExpressionStatement(): Statement | any {
    if (this.getCurrentToken().type != TokenType.Eq) {
      throw new Error(
        `invalid let statement. Expected ${TokenType.Eq} and got ${
          this.getCurrentToken().type
        }`
      );
    }
    this.consumeCurrentToken();
  }

  parse(): Program {
    while (
      this.getCurrentToken() &&
      this.getCurrentToken().type != TokenType.EOF
    ) {
      const currToken = this.consumeCurrentToken();
      switch (currToken.type) {
        case TokenType.Let:
          this.statements.push(this.parseLetStatement());
          continue;
        case TokenType.Number:
          this.statements.push(this.parseExpressionStatement());
          continue;
        default:
          throw new Error(`parser hasn't implemented token: ${currToken}`);
      }
    }
    return {
      type: "Program",
      body: [...this.statements],
    };
  }

  consumeCurrentToken(): Token {
    return this.tokens.shift();
  }

  getCurrentToken(): Token {
    return this.tokens[0];
  }
}
