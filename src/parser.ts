import { Token, TokenType } from "./lexer";

type expressionType =
  | "BinaryExpression"
  | "NumberExpression"
  | "StringExpression";
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
  debug?(): string;
}

export interface Expression extends Node {
  type: expressionType;
}

export interface Statement extends Node {
  type: statementType;
  expression: Expression;
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

export interface StringExpression extends Expression {
  type: expressionType;
  literal: string;
}

export interface BinaryExpression extends Expression {
  type: expressionType;
  leftOperand: Expression;
  rightOperand: Expression;
  operator: Token;
}

// Based on rules of PEMDAS (Please excuse my dear Aunt Sally ;)
const bindingPowerLookup = {
  [TokenType.Minus]: 1,
  [TokenType.Add]: 1,
  [TokenType.Div]: 2,
  [TokenType.Mult]: 2,
} as Record<TokenType, number>;

export class Parser {
  private tokens: Array<Token>;
  private statements: Array<Statement>;

  // Prefix handling using "Pratt parsing". Each function is assumed
  // to consume the current token!
  nullDenotationFn = {
    [TokenType.Number]: this.parseNumberExpression.bind(this),
    [TokenType.String]: this.parseStringExpression.bind(this),
  } as Record<TokenType, () => Expression>;

  leftDenotationFn = {
    [TokenType.Add]: this.parseBinaryExpression.bind(this),
    [TokenType.Minus]: this.parseBinaryExpression.bind(this),
    [TokenType.Div]: this.parseBinaryExpression.bind(this),
    [TokenType.Mult]: this.parseBinaryExpression.bind(this),
  } as Record<TokenType, (l: Expression, bp: number) => Expression>;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.statements = new Array<Statement>();
  }

  parseNumberExpression(): NumberExpression {
    const expressionValue = this.consumeCurrentToken().value;
    return {
      type: "NumberExpression",
      literal: parseInt(expressionValue),
      debug: (): string => expressionValue,
    };
  }

  parseStringExpression(): StringExpression {
    const expressionValue = this.consumeCurrentToken().value;
    return {
      type: "StringExpression",
      literal: expressionValue,
      debug: (): string => `'${expressionValue}'`,
    };
  }

  parseBinaryExpression(
    leftOperand: Expression,
    bindingPower: number
  ): BinaryExpression {
    // eat the operator before recursing deeper since we already have both a reference
    // to the operator as well as the operators binding power in this callstack.
    const currOperator = this.consumeCurrentToken();
    const newLeftOperand = leftOperand;
    const rightOperand = this.parseExpression(bindingPower);

    return {
      type: "BinaryExpression",
      leftOperand: newLeftOperand,
      rightOperand,
      operator: currOperator,
      debug: (): string =>
        `${leftOperand.debug()} ${currOperator.value} ${rightOperand.debug()}`,
    };
  }

  // 10 + 9 * 2
  parseExpression(bindingPower: number): Expression {
    // get function to parse the prefix expression
    const nullDenotationFn = this.nullDenotationFn[this.getCurrentToken().type];
    if (!nullDenotationFn) {
      throw new Error(
        `invalid expression. Expected prefix expression for ${this.getCurrentToken()}, but it was missing from the nullDenotationFn map`
      );
    }

    // if number, get parser for number and increment to operator
    let left = nullDenotationFn();
    const currBindingPower = bindingPowerLookup[this.getCurrentToken().type];
    while (
      // get the parse function for handling a particular operator
      this.leftDenotationFn[this.getCurrentToken().type] &&
      currBindingPower >= bindingPower
    ) {
      const leftDenotationFn =
        this.leftDenotationFn[this.getCurrentToken().type];
      left = leftDenotationFn(left, currBindingPower);
    }
    return left;
  }

  parseLetStatement(): LetStatement {
    // eat the let
    this.consumeCurrentToken();
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

    const expression = this.parseExpression(0);
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
      debug: (): string => {
        return `let ${expectedSymbol.value} = ${
          expression.debug
            ? expression.debug()
            : `<ERROR: node: ${expression.type} has not yet implemented debug()>`
        };`;
      },
    };
  }

  parseExpressionStatement(): Statement | any {
    return this.parseExpression(0);
  }

  parse(): Program {
    while (this.getCurrentToken().type != TokenType.EOF) {
      const currToken = this.getCurrentToken();
      switch (currToken.type) {
        case TokenType.EOF:
          this.consumeCurrentToken();
          break;
        case TokenType.Let:
          this.statements.push(this.parseLetStatement());
          continue;
        case TokenType.String:
        case TokenType.Number:
          this.statements.push(this.parseExpressionStatement());
          continue;
        default:
          throw new Error(
            `parser hasn't implemented token: ${JSON.stringify(currToken)}`
          );
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
