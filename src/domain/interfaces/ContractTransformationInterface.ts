interface ContractTransformationInterface {
  regexDomain: RegExp;
  regexPowers: RegExp;
  regexObligations: RegExp;
  regexSurvivingObls: RegExp;
  regexContract: RegExp;

  getParts(
    domain: { [key: string]: string },
    contract: { [key: string]: string }
  ): string[];

  createObligations(
    obligationsGroup: {
      [key: string]: string;
    },
    surviving: boolean
  ): Obligation[];

  createPowers(powersGroup: { [key: string]: string }): LegalPosition[];

  readContractParameters(parameters: string): { name: string; type: string }[];

  createDomain(domain: { [key: string]: string }): Domain[];
}

export default ContractTransformationInterface;
