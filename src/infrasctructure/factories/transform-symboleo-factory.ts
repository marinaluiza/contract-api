import BaseCommandInterface from "../../domain/commands/base-command";
import TransformSymboleoCommand from "../../domain/commands/transform-symboleo-command";
import CreateDiagram from "../../domain/services/create-diagram-service";
import CreateDiagramSymboleo from "../../domain/services/create-symboleo-diagram-service";
import ContractTransformation from "../../domain/services/transform-contract-service";
import ContractTransformationSymboleo from "../../domain/services/transform-symboleo-contract-service";
import { BaseFactoryInterface } from "./base-factory";

class TransformSymboleoFactory implements BaseFactoryInterface {
    create(): BaseCommandInterface {
        const ContractTransformationService = new ContractTransformation(new ContractTransformationSymboleo());
        const CreateDiagramService = new CreateDiagram(new CreateDiagramSymboleo());
        return new TransformSymboleoCommand({ContractTransformationService, CreateDiagramService })
    }

    
}

export default TransformSymboleoFactory;