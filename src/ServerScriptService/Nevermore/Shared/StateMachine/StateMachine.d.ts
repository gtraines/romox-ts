export interface IStateMachineState {
    StateId : string;
	Name : string;
	InternalData : any;
	NextStatesNames : Array<string>;
	NextStates : Array<IStateMachineState>;
	Wait : number;
    IsRunning : boolean;
    PrintInternalDataTable() : void;
    CanTransitionFrom(previousState : IStateMachineState, data : any) : boolean;
    StateStoppedCallback() : void;
    CanPerformAction(data : any) : boolean;
    Action() : boolean;
    Init() : void;
}

export interface IStateMachine {
    NewState(stateName : string) : IStateMachineState;
    Stop(stateToStop: IStateMachineState) : void;
    AddState(state : IStateMachineState) : void;
    ClearContextItems() : void;
    TryTransition(data : any) : boolean;
    Next(data : any) : void;
    Start(startingState : IStateMachineState, data : any) : void;
    Update( data : any ) : void;
    PrintStateGraph() : void;
}

export interface IStateMachineMachine {
    NewStateMachine: () => IStateMachine;
    NewState: ( newStateName : string ) => IStateMachineState;
}