interface Contract {
    name?: string;
    parts: string[];
    obligations: Obligation[];
    survivingObligations: Obligation[];
    powers: LegalPosition[];
}

class Contract {
    constructor({name, parts, obligations, survivingObligations, powers} : Contract) {
        this.name = name;
        this.parts = parts;
        this.obligations = obligations;
        this.survivingObligations = survivingObligations;
        this.powers = powers;
    }
}