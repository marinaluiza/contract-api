interface TransitionInterface {
    event: string;
    guard: string;
    actions: string[];
}

class Transition {
    event;
    guard;
    actions;
    
    constructor({event, guard, actions} : TransitionInterface) {
        this.event = event;
        this.guard = guard;
        this.actions = actions;
    }
}