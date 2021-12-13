
interface Domain  {
    name: string;
    specialization: string;
    attributes: { key: string; value: string }[];
}

class Domain {
    constructor({name, specialization, attributes} : Domain) {
        this.name = name;
        this.specialization = specialization;
        this.attributes = attributes;
    }
}