import { Request, Response } from "express";
import BaseCommandInterface from "../../domain/commands/base-command";

export interface HandlerInterface {
  handle(): void;
  buildInput() : {};
}

export interface HandlerConstructor {
  new (
    request: Request,
    response: Response,
    command: BaseCommandInterface
  ): HandlerInterface;
}

export const createHandler = (
  ctor: HandlerConstructor,
  request: Request,
  response: Response,
  command: BaseCommandInterface
): HandlerInterface => {
  return new ctor(request, response, command);
};
const HTTP_METHODS_WITH_BODY = ["PATCH", "POST", "PUT"];
class Handler implements HandlerInterface {
  request;
  response;
  command;

  constructor(
    request: Request,
    response: Response,
    command: BaseCommandInterface
  ) {
    this.request = request;
    this.response = response;
    this.command = command;
  }

  async handle() {
    try {
      await this.command.execute(this.buildInput(), this.response);
    } catch (error) {
      this.response.send(error);
    }
  }

  buildInput() {
    const paramsSources = [];
    if (HTTP_METHODS_WITH_BODY.includes(this.request.method)) {
      paramsSources.unshift({ body: this.request.body });
    }
    const tmp_path = this.request.file?.path;
    if(tmp_path) {
        paramsSources.unshift({ file: tmp_path })
    }

    return Object.assign({}, ...paramsSources);
  }
}

export default Handler;
