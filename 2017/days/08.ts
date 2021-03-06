import { getAsArray } from '../input';
import { success, end } from '../utils/logger';

enum Operation {
  inc,
  dec,
}

enum Condition {
  Less = '<',
  Greater = '>',
  Eq = '==',
  NotEq = '!=',
  GreaterOrEq = '>=',
  LessOrEq = '<=',
}

interface Register {
  [key: string]: number;
}

interface Instruction {
  receiver: string;
  operation: Operation;
  quantity: number;
  arg1: string;
  condition: string;
  arg2: number;
}

export default (): void => {
  const input = getAsArray('08.txt');

  const instructions = input.map(
    (o): Instruction => {
      const [, receiver, operation, quantity, arg1, condition, arg2] =
        o.match(/(\w+) (inc|dec) (-?\d+) if (\w+) (\W+) (-?\d+)/) ?? [];

      return {
        receiver,
        operation: operation === 'inc' ? Operation.inc : Operation.dec,
        quantity: parseInt(quantity, 10),
        arg1,
        condition,
        arg2: parseInt(arg2, 10),
      };
    }
  );

  let absMaxValue = 0;
  const registers: Register = {};

  instructions.forEach((o): void => {
    const { receiver, operation, quantity, arg1, condition, arg2 } = o;

    if (checkInstruction(registers[arg1], condition, arg2)) {
      if (operation === Operation.inc) {
        registers[receiver] = (registers[receiver] ?? 0) + quantity;
      } else {
        registers[receiver] = (registers[receiver] ?? 0) - quantity;
      }
    }

    const maxValue = calcHighestValue(Object.values(registers));

    if (maxValue > absMaxValue) {
      absMaxValue = maxValue;
    }
  });

  const maxRegisterValue = calcHighestValue(Object.values(registers));
  success(`Part 1: ${maxRegisterValue}`);

  success(`Part 2: ${absMaxValue}`);

  end();
};

const checkInstruction = (
  arg1 = 0,
  condition: string,
  arg2: number
): boolean => {
  switch (condition) {
    case Condition.Less:
      return arg1 < arg2;
    case Condition.Greater:
      return arg1 > arg2;
    case Condition.Eq:
      return arg1 === arg2;
    case Condition.NotEq:
      return arg1 !== arg2;
    case Condition.GreaterOrEq:
      return arg1 >= arg2;
    case Condition.LessOrEq:
      return arg1 <= arg2;
    default:
      throw new Error(`No case matched: ${condition}`);
  }
};

const calcHighestValue = (numbers: number[]): number =>
  numbers.sort((a, b): number => b - a)[0] ?? 0;
