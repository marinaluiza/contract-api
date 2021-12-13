import ContractTransformationInterface from "../interfaces/ContractTransformationInterface";

class ContractTransformation {
  contractTransformation: ContractTransformationInterface;

  constructor(contractTransformation: ContractTransformationInterface) {
    this.contractTransformation = contractTransformation;
  }

  public execute(file: String): Contract {
    const domain = file.match(this.contractTransformation.regexDomain);
    const contract = file.match(this.contractTransformation.regexContract);
    const powers = file.match(this.contractTransformation.regexPowers);
    const obligations = file.match(
      this.contractTransformation.regexObligations
    );
    const surviving = file.match(
      this.contractTransformation.regexSurvivingObls
    );

    const parts = this.contractTransformation.getParts(
      domain?.groups || {},
      contract?.groups || {}
    );
    const obligationsObj = this.contractTransformation.createObligations(
      obligations?.groups || {},
      false
    );
    const survivingObj = this.contractTransformation.createObligations(
      surviving?.groups || {},
      true
    );
    const powersObj = this.contractTransformation.createPowers(
      powers?.groups || {}
    );

    return {
      parts,
      obligations: obligationsObj,
      powers: powersObj,
      survivingObligations: survivingObj,
    };
  }
}

export default ContractTransformation;