export interface Domain {
  name: string;
  specialization: string;
  attributes: { key: string; value: string }[];
}

export interface LegalPosition {
  name: string;
  debtor: string;
  creditor: string;
  antecedent: string;
  consequent: string;
  trigger: string;
}

export interface Obligation extends LegalPosition {
    surviving: boolean;
}

export interface Contract {
    parts: string[];
    obligations: Obligation[];
    survivingObligations: Obligation[];
    powers: LegalPosition[];
}


export interface Transition {
    event: string;
    guard: string;
    actions: string[];
}