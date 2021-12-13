import ContractTransformationInterface from "../interfaces/ContractTransformationInterface";


class ContractTransformationSymboleoService
  implements ContractTransformationInterface
{
  regexDomain = /^Domain\s(?<domainName>\w*\d*)\n+(?<domains>.*)endDomain/s;
  regexContract =
    /Contract\s(?<contractName>\w*\d*)\s\((?<parameters>.*)\)\n+Declarations/s;
  regexPowers = /Powers(?<powers>.*)Constraints/s;
  regexObligations = /Obligations(?<obligations>.*)Surviving Obligations/s;
  regexSurvivingObls = /Surviving Obligations(?<obligations>.*)Powers/s;

  public getParts(
    domain: { [key: string]: string },
    contract: { [key: string]: string }
  ): string[] {
    const domains: Domain[] = this.createDomain(domain);
    const roleDomains = domains
      .filter((domain) => domain.specialization === "Role")
      .map((domain) => domain.name);
    const contractParameters = this.readContractParameters(
      contract?.parameters
    );
    const parts = contractParameters
      .filter((parameter) => roleDomains.includes(parameter.type))
      .map((parameter) => parameter.name);

    return parts;
  }

  public createObligations(
    obligationsGroup: {
      [key: string]: string;
    },
    surviving: boolean = false
  ): Obligation[] {
    const obligations: Obligation[] = [];
    const obligationsMatchArray = obligationsGroup?.obligations
      ? obligationsGroup?.obligations.trim().split(";")
      : [];
    const regexObligation = /O\((?<obligationCore>.*)\)/;

    obligationsMatchArray.forEach((obligationString) => {
      obligationString = obligationString.trim();
      const [oblName, oblContent] = obligationString.split(":");
      const [firstPart, secondPart] = oblContent ? oblContent.split("->") : [];
      const obligationMain = secondPart || firstPart;
      if (obligationMain) {
        const obligationCoreMatch = obligationMain
          .replace(" ", "")
          .match(regexObligation);

        const obligationCore = obligationCoreMatch?.groups?.obligationCore;
        if (obligationCore) {
          const splitRegex = /,(?!\s\w+\))/;
          const [debtor, creditor, antecedent, consequent] = obligationCore
            .replace(" ", "")
            .split(splitRegex)
            .map((part) => part && part.trim());
          obligations.push({
            name: oblName.trim(),
            debtor,
            creditor,
            antecedent,
            consequent,
            trigger: secondPart ? firstPart.trim() : "",
            surviving,
          });
        }
      }
    });
    return obligations;
  }

  public createPowers(powersGroup: { [key: string]: string }): LegalPosition[] {
    const powers: LegalPosition[] = [];
    const powerMatchArray = powersGroup?.powers
      ? powersGroup?.powers.trim().replace("\n", "").split(";")
      : [];
    const regexPower = /P\((?<powerCore>.*)\)/;

    powerMatchArray.forEach((powerString) => {
      powerString = powerString.trim();
      const [pwrName, pwrContent] = powerString.split(":");
      const [firstPart, secondPart] = pwrContent ? pwrContent.split("->") : [];
      const powerMain = secondPart || firstPart;
      if (powerMain) {
        const powerCoreMatch = powerMain.replace(" ", "").match(regexPower);

        const powerCore = powerCoreMatch?.groups?.powerCore;
        if (powerCore) {
          const splitRegex = /,(?!\s\w*\))/;
          const [debtor, creditor, antecedent, consequent] = powerCore
            .replace(" ", "")
            .split(splitRegex)
            .map((part) => part && part.trim());
          powers.push({
            name: pwrName.trim(),
            debtor,
            creditor,
            antecedent,
            consequent,
            trigger: secondPart ? firstPart.trim() : "",
          });
        }
      }
    });
    return powers;
  }

  public readContractParameters(
    parameters: string
  ): { name: string; type: string }[] {
    parameters = parameters && parameters.trim();
    const paramsArray = parameters.split(",");
    const formattedParams = paramsArray.map((param) => {
      const paramValues = param.split(":");
      return { name: paramValues[0].trim(), type: paramValues[1].trim() };
    });

    return formattedParams;
  }

  public createDomain(domain: { [key: string]: string }): Domain[] {
    const domainBlock = domain?.domains.trim().replace("\n", "");
    const domainLines = domainBlock.split(";");
    let domains: Domain[] = [];
    domainLines.forEach((line) => {
      const regex =
        /^(?<name>.*)(isA|isAn)\s+(?<specialization>.*)with(?<attributes>.*)$/s;
      const result = line.match(regex);
      const attributesArray = result?.groups?.attributes.split(",");

      const attributes =
        attributesArray &&
        attributesArray.map((attribute) => {
          attribute.split(":");
          return { key: attribute[0].trim(), value: attribute[1].trim() };
        });
      if (
        result?.groups?.name &&
        result?.groups?.specialization &&
        attributes
      ) {
        domains.push({
          name: result.groups.name.trim().replace("\n", ""),
          specialization: result.groups.specialization.trim().replace("\n", ""),
          attributes,
        });
      }
    });

    return domains;
  }
}

export default ContractTransformationSymboleoService;
