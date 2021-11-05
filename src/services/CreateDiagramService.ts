import { Contract, Transition } from "../interfaces/objects";
import jsonModel from "../resources/diagramModel.json";
import CreateDiagramInterface from "../interfaces/CreateDiagramInterface";

class CreateDiagramService {
  createDiagram: CreateDiagramInterface;

  constructor(createDiagram: CreateDiagramInterface) {
    this.createDiagram = createDiagram;
  }

  public execute(contract: Contract) {
    this.createDiagram.setContract(contract);

    const newDiagram = { ...jsonModel };
    const setOfFulfilledObligations = this.createDiagram.fulfillObligations();
    let {
      transitions: {
        create_contract,
        activate_contract,
        activate_obligation_power,
        suspend_contract,
        resume_contract,
        fulfill_active_obligations,
        revoke_party,
        assign_party,
        terminate_contract,
        activate_surviving_obligation,
      },
      state_actions: { successful_termination, unsuccessful_termination },
    } = newDiagram;

    create_contract.obligations = this.createDiagram.legalPositionsToBeCreated(
      contract.obligations
    );
    create_contract.powers = this.createDiagram.legalPositionsToBeCreated(
      contract.powers
    );
    create_contract.parties = contract.parts;

    activate_contract.obligations =
      this.createDiagram.legalPositionsToBeActivatedWithContract(
        contract.obligations
      );
    activate_contract.powers =
      this.createDiagram.legalPositionsToBeActivatedWithContract(
        contract.powers
      );

    activate_obligation_power.events = [...this.createObligationsEvents(), ...this.createPowersEvents()];

    suspend_contract.powers = this.createDiagram.powersThatSuspendContract();
    suspend_contract.powers_activated =
      this.createDiagram.legalPositionsActivatedByContractSuspension(
        contract.powers
      );
    suspend_contract.obligations_activated =
      this.createDiagram.legalPositionsActivatedByContractSuspension(
        contract.obligations
      );

    resume_contract.powers = this.createDiagram.powersThatResumeContract();
    revoke_party.powers = this.createDiagram.powersThatRevokeParty();
    assign_party.powers = this.createDiagram.powersThatAssignParty();

    terminate_contract.powers =
      this.createDiagram.powersThatTerminateContract();
    terminate_contract.obligations_unfulfilled =
      this.createDiagram.unfulfilledObligations(setOfFulfilledObligations);

    fulfill_active_obligations.set_of_obligations = setOfFulfilledObligations;

    activate_surviving_obligation.events =
      this.createDiagram.survivingWithConditions();

    successful_termination.surviving_obligations = this.createDiagram.survivingWhenSuccessfulTermination()
    unsuccessful_termination.surviving_obligations = this.createDiagram.survivingWhenUnsuccessfulTermination()
    return newDiagram
  }

  private createObligationsEvents = (): Transition[] => {
    let events: Transition[] = [];
    if (this.createDiagram.oblTriggeredByPower.length > 0) {
      const eventsByPower = this.parseToEvent(
        this.createDiagram.oblTriggeredByPower,
        "Power exertion",
        "Activate obligation"
      );
      events = [...events, ...eventsByPower];
    }
    if (this.createDiagram.oblTriggeredByOblViolation.length > 0) {
      const eventsByOblViolation = this.parseToEvent(
        this.createDiagram.oblTriggeredByOblViolation,
        "Obligation violation",
        "Activate obligation"
      );
      events = [...events, ...eventsByOblViolation];
    }
    if (this.createDiagram.oblTriggeredByCondition.length > 0) {
      const eventsByCondition = this.parseToEvent(
        this.createDiagram.oblTriggeredByCondition,
        "",
        "Activate obligation"
      );
      events = [...events, ...eventsByCondition];
    }
    return events;
  };

  private createPowersEvents = (): Transition[] => {
    let events: Transition[] = [];
    const powersToBeActivated = this.createDiagram.legalPositionsToBeActivated(
      this.createDiagram.contract.powers
    );
    if (powersToBeActivated?.obligation_unfulfilled?.length > 0) {
      const eventsByOblViolation = this.parseToEvent(
        powersToBeActivated.obligation_unfulfilled,
        "Obligation violation",
        "Activate power"
      );
      events = [...events, ...eventsByOblViolation];
    }
    if (powersToBeActivated?.condition?.length > 0) {
      const eventsByCondition = this.parseToEvent(
        powersToBeActivated.condition,
        "",
        "Activate power"
      );
      events = [...events, ...eventsByCondition];
    }
    return events;
  };

  private parseToEvent = (
    toParse: string[][],
    eventPrevix: string,
    actionPrefix: string
  ): Transition[] => {
    return toParse.map((obligation) => ({
      event: eventPrevix !== "" ? `${eventPrevix} <strong>${obligation[0]}</strong>` : this.createDiagram.formatEvent(obligation[0]),
      guard: "",
      actions: [`${actionPrefix} <strong>${obligation[1]}</strong>`],
    }));
  };
}

export default CreateDiagramService;
