import { TransitionInterface } from "./InterfaceDiagram";

interface CreateDiagramInterface {
  contract: Contract;
  setFulfilledObligations: string[][];
  oblTriggeredByOblViolation: string[][];
  oblTriggeredByPower: string[][];
  oblTriggeredByCondition: string[][];

  setContract(contract: Contract): void;
  legalPositionsToBeCreated(lp: LegalPosition[]): string[];
  legalPositionsToBeActivatedWithContract(lp: LegalPosition[]): string[];
  legalPositionsToBeActivated(lp: LegalPosition[]): {
    obligation_unfulfilled: string[][];
    condition: string[][];
  };
  powersThatSuspendContract(): string[];
  powersThatResumeContract(): string[];
  powersThatTerminateContract(): string[];
  survivingWhenUnsuccessfulTermination(): string[];
  survivingWhenSuccessfulTermination(): string[];
  powersThatRevokeParty(): string[];
  powersThatAssignParty(): string[];
  unfulfilledObligations(obligationsToUnfulfill: string[][]): string[][];
  fulfillObligations(): string[][];
  legalPositionsActivatedByContractSuspension(lp: LegalPosition[]): string[];
  survivingWithConditions(): TransitionInterface[];
  formatEvent(event: string): string;
}

export default CreateDiagramInterface;
