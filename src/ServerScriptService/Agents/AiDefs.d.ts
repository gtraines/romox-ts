import { IStateMachine, IStateMachineState } from '../Nevermore/Shared/StateMachine/StateMachineTypings';
import { IPathProgressData } from "../Nevermore/Shared/Senses/SensesTypings";

export interface IAiAgentContext {
    PersonageConfiguration : Table;
    Personage : Model;
    StateMachine : IStateMachine;   
}

export interface IAgentInterest {
    InterestPriority : number;
    InterestStrength :  number;
    InterestDwellTimeSecs: number;
    GetInterestStateMachine: (context : IAiAgentContext) => IStateMachine;
    DetermineInterest: (context : IAiAgentContext) => boolean;
    OnInterestedDelegate: (context : IAiAgentContext) => IAiAgentContext;
    StillInterestedDelegate:  (context : IAiAgentContext) => IAiAgentContext;
    OnLostInterestDelegate: (context : IAiAgentContext) => IAiAgentContext;
}

export interface IAiAgent {
    StateMachine : IStateMachine;
    WireUpStateMachine() : void;
}

export interface IPathfindingAi {
    StateMachine : IStateMachine;
    MAX_FORCE : number;
    Personage : Model;
    CancelPathRequested : boolean;
    RequestPathCancellation() : void;
    GetOnWaypointReachedDelegate(pathProgressData : IPathProgressData) :  (reached: boolean) => void;
    GetOnPathBlockedDelegate(pathProgressData : IPathProgressData, 
        destinationPart : Part, displayWaypointMarkers : boolean) : (blockedWaypointIndex: number) => void;
    MoveTo( destinationPart : Part, displayWaypointMarkers : boolean) : IPathProgressData;
    GetRepulsionVector(unitPosition : Vector3, otherUnitsPosition : Vector3) : Vector3;
    GetNewState(stateName : string) : IStateMachineState;
    GetIdleState() : IStateMachineState;
    LoadConfig(configSource : Table, configName : string, defaultValue : any) : void;
    GetConfigValue(configName : string) : any;
}