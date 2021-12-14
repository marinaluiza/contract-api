import CreateDiagramInterface from "../interfaces/CreateDiagramInterface";


import {events as contractEvents, states as contractStates} from "../enums/symboleo/Contract"
import {events as obligationEvents, states as obligationStates} from "../enums/symboleo/Obligation"
import {events as powerEvents, states as powerStates} from "../enums/symboleo/Power"

class CreateDiagramSymboleo implements CreateDiagramInterface {
  oblViolationPattern =
    /(oVIOLATION|oVIOLATED|Violated|Violation)\((?<obligation>.+?)\)/;
  powerExertionPattern = /(pEXERTED|pEXERTION|Exerted)\((?<power>.+?)\)/;
  suspendContractPattern =
    /(cSUSPENDED|cSUSPENSION|Suspended|Suspension)\((.+?)\)/;
  resumeContractPattern = /(cRESUMED|Resumed)\((.+?)\)/;
  terminateContractPattern = /(cTERMINATED|Terminated)\((.+?)\)/;
  revokePartyPattern = /(cREVOKED_PARTY|RevokedParty|UnAssign)\((.+?)\)/;
  assignPartyPattern = /(cASSIGNED_PARTY|AssignedParty)\((.+?)\)/;

  
  eventPattern = /(?<negation>(NOT|Not|not))?\(?(?<proposition>happens|Happens)\((?<event>.+?)\)\(?/;
  eventWithTimePattern = /(?<negation>(NOT|Not|not))?\(?(?<proposition>HappensBefore|happensBefore|HappensAfter|happensAfter)\((?<event>.+?),(?<time>.+?)\)\)?/
  happensWithinPattern =
  /(?<negation>(NOT|Not|not))?\(?(?<proposition>HappensWithin|happensWithin)\((?<event>.+?),(?<interval>.+?)\)\)?/;
  occursPattern =
    /(?<negation>(NOT|Not|not))?\(?(?<proposition>Occurs|occurs)\((?<situation>.+?),(?<interval>.+?)\)\)?/;

  contract: Contract = {
    name: '',
    parts: [],
    obligations: [],
    powers: [],
    survivingObligations: [],
  };
  setFulfilledObligations: string[][] = [];
  oblTriggeredByOblViolation: string[][] = [];
  oblTriggeredByPower: string[][] = [];
  oblTriggeredByCondition: string[][] = [];

  setContract(contract: Contract) {
    this.contract = contract;
  }

  legalPositionsToBeCreated(legalPositions: LegalPosition[]): string[] {
    return legalPositions
      .filter((legalPosition) => legalPosition.trigger === "")
      .map((legalPosition) => legalPosition.name);
  }

  legalPositionsToBeActivatedWithContract(
    legalPositions: LegalPosition[]
  ): string[] {
    return legalPositions
      .filter(
        (legalPosition) =>
          legalPosition.trigger === "" && legalPosition.antecedent === "TRUE"
      )
      .map((legalPosition) => legalPosition.name);
  }

  legalPositionsToBeActivated(legalPositions: LegalPosition[]): {
    obligation_unfulfilled: string[][];
    condition: string[][];
  } {
    const map: { obligation_unfulfilled: string[][]; condition: string[][] } = {
      obligation_unfulfilled: [],
      condition: [],
    };
    legalPositions
      .filter((legalPosition) => legalPosition.trigger !== "")
      .forEach((legalPosition) => {
        const obligationMatch = this.isPowerActivatedByObligationViolation(
          legalPosition.trigger,
          legalPositions
        );
        obligationMatch
          ? map.obligation_unfulfilled.push([
              obligationMatch,
              legalPosition.name,
            ])
          : map.condition.push([this.formatEvent(legalPosition.trigger), legalPosition.name]);
      });
    return map;
  }

  powersThatSuspendContract(): string[] {
    return this.contract.powers
      .filter((power) => this.suspendContractPattern.test(power.consequent))
      .map((power) => power.name);
  }

  powersThatResumeContract(): string[] {
    return this.contract.powers
      .filter((power) => this.resumeContractPattern.test(power.consequent))
      .map((power) => power.name);
  }

  powersThatTerminateContract(): string[] {
    return this.contract.powers
      .filter((power) => this.terminateContractPattern.test(power.consequent))
      .map((power) => power.name);
  }

  survivingWhenUnsuccessfulTermination(): string[] {
    return this.contract.survivingObligations
      .filter(
        (obl) => obl.trigger && this.terminateContractPattern.test(obl.trigger)
      )
      .map((obl) => obl.name);
  }

  survivingWhenSuccessfulTermination(): string[] {
    return this.contract.survivingObligations
      .filter((obl) => !obl.trigger)
      .map((obl) => obl.name);
  }

  powersThatRevokeParty(): string[] {
    return this.contract.powers
      .filter((pwr) => this.revokePartyPattern.test(pwr.consequent))
      .map((pwr) => pwr.name);
  }

  powersThatAssignParty(): string[] {
    return this.contract.powers
      .filter((pwr) => this.assignPartyPattern.test(pwr.consequent))
      .map((pwr) => pwr.name);
  }

  unfulfilledObligations(obligationsToUnfulfill: string[][]): string[][] {
    return obligationsToUnfulfill.map((setOfObligation) => {
      return setOfObligation.map((obligation) => `~ ${obligation}`);
    });
  }

  fulfillObligations(): string[][] {
    const activeObligations = this.legalPositionsToBeCreated(
      this.contract.obligations
    );
    const triggeredObl = this.contract.obligations.filter((obl) => obl.trigger);
    const replacementMap = this.getReplacementObligationsMap(triggeredObl);

    const oblTriggeredByCondition = triggeredObl.filter(
      (obl) => !replacementMap[obl.name]
    );
    const oblTriggeredByConditionByName = oblTriggeredByCondition.map(
      (obl) => obl.name
    );
    this.oblTriggeredByCondition = oblTriggeredByCondition.map((obl) => [
      obl.trigger,
      obl.name,
    ]);

    const myListActiveObligations = [
      ...activeObligations,
      ...oblTriggeredByConditionByName,
    ];
    this.setFulfilledObligations.push(myListActiveObligations);

    this.replaceFulfilledObligations(replacementMap, triggeredObl);
    return this.setFulfilledObligations;
  }

  private replaceFulfilledObligations(
    replacementMap: { [key: string]: string },
    obligations: Obligation[]
  ): void {
    let newSets: string[][] = [];
    let notFoundedObligations: Obligation[] = [];
    obligations.forEach((obl) => {
      if (replacementMap[obl.name]) {
        let founded = false;
        const obligationToReplace = replacementMap[obl.name];
        this.setFulfilledObligations.forEach((fulfilledSet) => {
          const index = fulfilledSet.indexOf(obligationToReplace);
          if (index >= 0) {
            founded = true;
            let newSet = [...fulfilledSet];
            newSet[index] = obl.name;
            newSets.push(newSet);
          }
        });

        !founded && notFoundedObligations.push(obl);
        this.setFulfilledObligations = [
          ...this.setFulfilledObligations,
          ...newSets,
        ];
      }
    });

    notFoundedObligations.length > 0 &&
      this.replaceFulfilledObligations(replacementMap, notFoundedObligations);
  }

  legalPositionsActivatedByContractSuspension(
    legalPositions: LegalPosition[]
  ): string[] {
    return legalPositions
      .filter(
        (lp) => lp.trigger && this.suspendContractPattern.test(lp.trigger)
      )
      .map((lp) => lp.name);
  }

  survivingWithConditions(): Transition[] {
    return this.contract.survivingObligations
      .filter(
        (so) => so.trigger && !this.terminateContractPattern.test(so.trigger)
      )
      .map((so) => ({
        event: so.trigger,
        guard: "",
        actions: [`Activate obligation <strong>${so.name}</strong>`],
      }));
  }

  private isPowerActivatedByObligationViolation(
    trigger: string,
    legalPositions: LegalPosition[]
  ): string {
    const match = trigger.match(this.oblViolationPattern);
    if (match?.groups?.obligation) {
      return match?.groups?.obligation;
    } else {
      const notEventRegex = /not|NOT \((?<event>.*)\)/;
      const event = trigger.match(notEventRegex)?.groups?.event;
      if (trigger.match(notEventRegex)?.groups?.event) {
        const foundedObligation = legalPositions.find(
          (legalPositions) => legalPositions.consequent === event
        );
        return foundedObligation?.name || "";
      }
    }

    return "";
  }

  private findReplacementByPowerExertion(pwrName: string): string {
    const foundedPower = this.contract.powers.find(
      (power) => power.name === pwrName
    );
    const match =
      foundedPower && foundedPower.trigger.match(this.oblViolationPattern);
    return match?.groups?.obligation || "";
  }

  private getReplacementObligationsMap(triggeredObl: Obligation[]): {
    [key: string]: string;
  } {
    const replacementMap: { [key: string]: string } = {};
    triggeredObl.forEach((obl) => {
      const obligationMatch = obl.trigger.match(this.oblViolationPattern)
        ?.groups?.obligation;
      if (obligationMatch) {
        replacementMap[obl.name] = obligationMatch;
        this.oblTriggeredByOblViolation.push([obligationMatch, obl.name]);
        return;
      }
      const powerExertionMatch = obl.trigger.match(this.powerExertionPattern)
        ?.groups?.power;
      if (powerExertionMatch) {
        const oblToReplace =
          this.findReplacementByPowerExertion(powerExertionMatch);
        replacementMap[obl.name] = oblToReplace;
        this.oblTriggeredByPower.push([powerExertionMatch, obl.name]);
        return;
      }

      this.findTriggerOnPowers(obl, replacementMap);
    });
    return replacementMap;
  }

  findTriggerOnPowers(
    obl: Obligation,
    replacementMap: { [key: string]: string }
  ): void {
    const power = this.contract.powers.find(
      (pwr) => pwr.consequent === obl.trigger
    );
    if (power) {
      const powerMatch = power.trigger.match(this.oblViolationPattern);
      const oblName = powerMatch?.groups?.obligation;
      if (oblName) {
        replacementMap[obl.name] = oblName;
        this.oblTriggeredByOblViolation.push([oblName, obl.name]);
        return;
      }
      const notEventRegex = /not|NOT|Not \((?<event>.*)\)/;
      const event = power.trigger.match(notEventRegex)?.groups?.event;
      if (event) {
        const foundedObligation = this.contract.obligations.find(
          (obligation) => obligation.consequent === event
        );
        if (foundedObligation) {
          replacementMap[obl.name] = foundedObligation.name;
          this.oblTriggeredByOblViolation.push([
            foundedObligation.name,
            obl.name,
          ]);
        }
      }
    }
  }

  formatEvent(event: string): string {
    const eventMatch = event.match(this.eventPattern)?.groups;
    const allEvents = {...contractEvents, ...obligationEvents, ...powerEvents}
    const allStates = {...contractStates, ...obligationStates, ...powerStates}
    if (eventMatch) {
      const event = this.formatPropositionEvent(eventMatch.event, allEvents)
      return `${eventMatch.negation ? eventMatch.negation + ' ' : ''}${eventMatch.proposition} <strong>${event}</strong>}`;
    }
    const eventWithTimeMatch = event.match(this.eventWithTimePattern)?.groups;
    if (eventWithTimeMatch) {
      const proposition = eventWithTimeMatch.proposition.split(/(?=[A-Z][^A-Z])/);
      const event = this.formatPropositionEvent(eventWithTimeMatch.event.trim(), allEvents)
      const time = this.formatPropositionEvent(eventWithTimeMatch.time.trim(), allEvents)
      return `${eventWithTimeMatch.negation ? eventWithTimeMatch.negation + ' ' : ''}${proposition[0]} <strong>${event}</strong> ${proposition[1]} <strong>${time}</strong>`;
    }
    const happensWithinMatch = event.match(this.happensWithinPattern)?.groups;
    if (happensWithinMatch) {
      const proposition = happensWithinMatch.proposition.split(/(?=[A-Z][^A-Z])/);
      const event = this.formatPropositionEvent(happensWithinMatch.event.trim(), allEvents)
      const interval = this.formatPropositionEvent(happensWithinMatch.interval.trim(), allStates)
      return `${happensWithinMatch.negation ? happensWithinMatch.negation + ' ' : ''}${proposition[0]} <strong>${event}</strong> ${proposition[1]} <strong>${interval}</strong>`;
    }
    const occursMatch = event.match(this.occursPattern)?.groups;
    if (occursMatch) {
      const situation = this.formatPropositionEvent(occursMatch.situation, allStates)
      const interval = this.formatPropositionEvent(occursMatch.interval, allStates)
      return `${occursMatch.negation ? occursMatch.negation + ' ' : ''}${occursMatch.proposition} <strong>${situation}</strong> <strong>${interval}</strong>`;
    }
    return event;
  }

  formatPropositionEvent(proposition: string, allEvents: {[key: string]: string}) : string {
    const eventsKeys = Object.keys(allEvents).join('|')
    const regex = new RegExp(`(?<event>${eventsKeys})\\((?<object>[a-zA-Z0-9]+)\\)?`)
    const match = proposition.match(regex)
    if(match && match.groups?.event && match.groups?.object) {
      const eventDescription = allEvents[match.groups?.event]
      return `${eventDescription} ${match.groups.object}`

    }
    return proposition

  }
}

export default CreateDiagramSymboleo;
