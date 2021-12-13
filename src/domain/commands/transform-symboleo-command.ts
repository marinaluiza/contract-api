import { Response } from "express";
import CreateDiagramService from "../services/create-diagram-service";
import ContractTransformation from "../services/transform-contract-service";
import UploadFile from "../services/upload-file-service";
import BaseCommandInterface from "./base-command";

interface TransformSymboleoCommandInterface {
    ContractTransformationService : ContractTransformation;
    CreateDiagramService: CreateDiagramService
}

class TransformSymboleoCommand implements BaseCommandInterface {

    contractTransformationService;
    createDiagramService;

    constructor({ ContractTransformationService, CreateDiagramService } : TransformSymboleoCommandInterface) {
        this.contractTransformationService = ContractTransformationService;
        this.createDiagramService = CreateDiagramService;
      }

    execute(params: any, response : Response): void {
        const readFileCallback =  (err: NodeJS.ErrnoException, data : string) => {
            if (err) {
              console.error(err);
              return;
            }
            const contract = this.contractTransformationService.execute(data);
            const result = this.createDiagramService.execute(contract);
            response.send(result);
          };

          UploadFile.readFile(params.file, readFileCallback);
    }
    
}

export default TransformSymboleoCommand;