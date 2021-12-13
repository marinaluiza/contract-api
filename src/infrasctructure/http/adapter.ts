import { Response, Request } from "express";
import { HandlerConstructor, createHandler } from "./handler";
import { createFactory, FactoryConstructor } from "../factories/base-factory";

export default (
    HandlerConstructor: HandlerConstructor,
    CommandFactory: FactoryConstructor
  ) =>
  async (request: Request, response: Response ) => {
    const factory = createFactory(CommandFactory);
    const command = factory.create();
    const handler = createHandler(
      HandlerConstructor,
      request,
      response,
      command
    );
    await handler.handle();
  };
