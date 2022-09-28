export interface TransitionInterface {
    event: string;
    guard: string;
    actions: string[] | [];
}

interface TransitionDiagramInterface {
    source: string;
    target: string;
    events: TransitionInterface[]
}

interface StateActionsInterface {
    when: string;
    action: string;
    surviving_obligations: string[] | []
}

export interface DiagramInterface {
    name: string;
    states: {
        created: string;
        in_effect: string;
        suspended: string;
        unassign: string;
        successful_termination: string;
        unsuccessful_termination: string;
    };
    transitions: {
        create_contract?: TransitionDiagramInterface & {
            parties: string[] | [];
            obligations: string[] | [];
            powers: string[] | [];
        };
        activate_contract?: TransitionDiagramInterface & {
            obligations: string[] | [];
            powers: string[] | [];
        };
        activate_obligation_power?: TransitionDiagramInterface;
        suspend_contract?: TransitionDiagramInterface & {
            obligations_activated: string[] | [];
            powers_activated: string[] | [];
            powers: string[] | [];
        };
        resume_contract?: TransitionDiagramInterface & {
            obligations_activated: string[] | [];
            powers_activated: string[] | [];
            powers: string[] | [];
        };
        revoke_party?: TransitionDiagramInterface & {
            powers: string[] | [];
        };
        assign_party?: TransitionDiagramInterface & {
            powers: string[] | [];
        };
        fulfill_active_obligations?: TransitionDiagramInterface & {
            set_of_obligations: string[][] | [];
        };
        activate_surviving_obligation?: TransitionDiagramInterface;
        terminate_contract?: TransitionDiagramInterface & {
            powers: string[] | [];
            obligations_unfulfilled: string[][] | []
        }
    };
    state_actions: {
        successful_termination: StateActionsInterface;
        unsuccessful_termination: StateActionsInterface;
    }
}