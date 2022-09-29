import { DiagramInterface } from "../domain/interfaces/InterfaceDiagram";

export const cleanTransitions = (diagram: DiagramInterface):  DiagramInterface  => {
    const filteredDiagram = {...diagram}
    const transitions = filteredDiagram.transitions
    const transitionKeys = Object.keys(transitions).forEach((key) => {
        // if (key === "create_contract" && 
        //     transitions.create_contract!.obligations.length === 0 &&
        //     transitions.create_contract!.powers.length === 0 &&
        //     transitions.create_contract!.parties.length === 0
        // ) {
        //     delete filteredDiagram.transitions.create_contract
        // }
        // if (key === "activate_contract" && 
        //     transitions.activate_contract!.obligations.length === 0 &&
        //     transitions.activate_contract!.powers.length === 0
        // ) {
        //     delete filteredDiagram.transitions.activate_contract
        // }
        if (key === "suspend_contract" && 
            transitions.suspend_contract!.powers_activated.length === 0 &&
            transitions.suspend_contract!.obligations_activated.length === 0 &&
            transitions.suspend_contract!.powers.length === 0
        ) {
            delete filteredDiagram.transitions.suspend_contract
        }
        if (key === "resume_contract" && 
            transitions.resume_contract!.powers_activated.length === 0 &&
            transitions.resume_contract!.obligations_activated.length === 0 &&
            transitions.resume_contract!.powers.length === 0
        ) {
            delete filteredDiagram.transitions.resume_contract
        }
        if (key === "revoke_party" && 
            transitions.revoke_party!.powers.length === 0
        ) {
            delete filteredDiagram.transitions.revoke_party
        }
        if (key === "assign_party" && 
            transitions.assign_party!.powers.length === 0
        ) {
            delete filteredDiagram.transitions.assign_party
        }
        if (key === "fulfill_active_obligations" && 
            transitions.fulfill_active_obligations!.set_of_obligations.length === 0
        ) {
            delete filteredDiagram.transitions.fulfill_active_obligations
        }
        if (key === "terminate_contract" && 
            transitions.terminate_contract!.powers.length === 0 &&
            transitions.terminate_contract!.obligations_unfulfilled.length === 0
        ) {
            delete filteredDiagram.transitions.terminate_contract
        }      
    })
   
    return filteredDiagram
}

