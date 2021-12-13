
interface ObligationInterface extends LegalPosition {
    surviving: boolean;
}

class Obligation extends LegalPosition {
    surviving : boolean;

    constructor({name, debtor, creditor, antecedent, consequent, trigger, surviving} : Obligation) {
        super({name, debtor, creditor, antecedent, consequent, trigger});
        this.surviving = surviving;
    }
}