import {
  BinaryExpression,
  Expression,
  LetStatement,
  NumberExpression,
  Program,
  Statement,
} from "./parser";

import { TokenType } from "./lexer";

interface Scope {
  variables: Record<string, any>;
}

export class Interpreter {
  constructor(private program: Program) {}

  interpretNumberExpression(expression: NumberExpression) {
    return expression.literal;
  }

  interpretBinaryExpression(expression: BinaryExpression) {
    const { leftOperand, rightOperand, operator } = expression;
    const leftEval = this.interpretExpression(leftOperand);
    const rightEval = this.interpretExpression(rightOperand);

    switch (operator.type) {
      case TokenType.Add:
        return leftEval + rightEval;
      case TokenType.Mult:
        return leftEval * rightEval;
      case TokenType.Div:
        return leftEval / rightEval;
      case TokenType.Minus:
        return leftEval - rightEval;
    }
  }

  interpretExpression(expression: Expression) {
    switch (expression.type) {
      case "BinaryExpression":
        return this.interpretBinaryExpression(expression as BinaryExpression);
      case "NumberExpression":
        return this.interpretNumberExpression(expression as NumberExpression);
    }
  }

  interpretLetStatement(statement: LetStatement, env: Scope) {
    const { expression } = statement;

    switch (expression.type) {
      case "BinaryExpression":
        env[statement.identifier] = this.interpretBinaryExpression(
          expression as BinaryExpression
        );
    }
  }

  interpret() {
    const envScope = { variables: [] };
    for (const statement of this.program.body) {
      /**
       * Here we need to parse all the statements one by one and decompose the statements to actuall begin the evaluation process
       */
      const { type } = statement;
      switch (type) {
        case "LetStatement":
          const interpretedLetStatement = this.interpretLetStatement(
            statement as LetStatement,
            envScope
          );
          console.log(interpretedLetStatement);
      }
    }
  }
}
