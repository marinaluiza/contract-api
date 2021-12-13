import { Response } from "express";

interface BaseCommandInterface {
    execute(params : any, response : Response) : void;
}

export default BaseCommandInterface