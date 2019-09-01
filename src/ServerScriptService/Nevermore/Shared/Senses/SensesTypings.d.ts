import { PathfindingService } from "@rbxts/services";

export interface AzimuthVector {
    ToTargetOffsets : Vector3;
    AzimuthDegrees : number;
}

export interface IPathProgressData {
    CurrentTargetPos: any;
    LastTargetPos: any;
    Waypoints: Array<PathWaypoint>;
    Path: Path;
    CurrentWaypointIndex: number;
    PathBlockedEventConnection: RBXScriptConnection;
    WaypointReachedEventConnection: RBXScriptConnection;
    PathCalculationAttempts: number;
    MAX_PATH_CALCULATION_ATTEMPTS: number;
}

export interface IPathParameters {
    AgentRadius: number;
    AgentHeight: number;
}

export interface IPersonageMovementParameters {
    TargetOffsetMax: number;
    JumpThreshold: number;
    NextPointThreshold: number;
}

export interface IPathfinderModule {
    GetPathForPersonage: (personage : Model, destinationObject : Part, pathParams : { AgentRadius:number, AgentHeight:number}) 
        => IPathProgressData;
    ClearPathWaypointMarkers: () => void;
    DisplayPathWaypoints: (pathProgressData : IPathProgressData) => void;
    MovePersonageOnPath: (personage : Model, 
        pathProgressData: IPathProgressData, 
        onWaypointReachedDelegate: (waypointReached: boolean) => void, 
        personageMovementParams: {TargetOffsetMax: number, JumpThreshold: number, NextPointThreshold: number}) 
        => IPathProgressData;
}

export interface IDestinationsModule {
    GetRandomCFramFromTableOfParts: (candidatePartsTable : Table) => CFrame;
}

export interface IPerceptionModule {
    Raycast: 
        (ray : any, blacklist : Array<Part>, partToCheck : Part) 
        => Array<Part>;
    GetIsInLineOfSight: 
        (origin : Vector3, character : Vector3, range : number, blacklist : Array<Part>) 
        => boolean;
    IsSpaceEmpty: 
        (position : Vector3) => boolean;
    GetRandomXZOffsetNear: 
        (targetVector3 : Vector3) => Vector3;
    FindEmptySpaceCloseTo: 
        (targetVector3 : Vector3) => Vector3;
    WideRayCast: 
        (start : Vector3, target : Vector3, offset : number, ignoreList : Array<Part>) 
        => Array<Part>;
    FindNearestPathPoint: 
        (path : Path, point : Vector3, start : Vector3, target : Vector3, ignoreList : Array<Part>) 
        => Vector3;
    ShootAzimuth: 
        (fromPosition : Vector3, fromLookVector : Vector3, toPosition : Vector3) 
        => AzimuthVector;
    CanHunterSeeTarget: 
        (hunterTorso : Part, hunterFieldOfViewDegrees : number, targetTorso : Part, ignoreList : Array<Part>) 
        => boolean;
    GetClosestVisibleTarget: 
        (hunterPersonage : Model, candidateTargets : Array<Model>, ignoreList : Array<Model>, fieldOfView : number) 
        => Model;
}