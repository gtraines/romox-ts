import { IStateMachine, IStateMachineState } from '../Nevermore/Shared/StateMachine/StateMachine';
export interface IPathProgressData {

}
export interface IPathfindingAi {
    StateMachine : IStateMachine;
    MAX_FORCE : number;
    Personage : Model;
    GetOnWaypointReachedDelegate(pathProgressData : IPathProgressData) : Function;
    GetOnPathBlockedDelegate(pathProgressData : IPathProgressData, 
        destinationPart : Part, displayWaypointMarkers : boolean) : Function;
    MoveTo( destinationPart : Part, displayWaypointMarkers : boolean) : IPathProgressData;
    GetRepulsionVector(unitPosition : Vector3, otherUnitsPosition : Vector3) : Vector3;
    GetNewState(stateName : string) : IStateMachineState;
    GetIdleState() : IStateMachineState;
    LoadConfig(configSource : Table, configName : string, defaultValue : any) : void;
    GetConfigValue(configName : string) : any;
}