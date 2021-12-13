
interface LegalPosition  {
    name: string;
    debtor: string;
    creditor: string;
    antecedent: string;
    consequent: string;
    trigger: string;
}

class LegalPosition {

    constructor({name, debtor, creditor, antecedent, consequent, trigger} : LegalPosition) {
        this.name= name;
        this.debtor= debtor;
        this.creditor= creditor;
        this.antecedent= antecedent;
        this.consequent= consequent;
        this.trigger= trigger;
    }
}
