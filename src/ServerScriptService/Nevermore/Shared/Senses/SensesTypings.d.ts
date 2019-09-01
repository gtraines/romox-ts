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