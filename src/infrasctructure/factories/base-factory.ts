import BaseCommandInterface from "../../domain/commands/base-command"

export interface BaseFactoryInterface {
     create() : BaseCommandInterface
}

export interface FactoryConstructor {
    new (): BaseFactoryInterface;
  }

export const createFactory = (ctor : FactoryConstructor) => {
    return new ctor()
}