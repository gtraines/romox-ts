export interface IRandumbModule {
    Init(sortOfSeed : number) : void;
    GetOneAtRandom<T>(collection : Array<T>) : T;
    CoinFlip<T>(choiceA : T, choiceB : T) : T;
    GetIntegerBtwn(start : number, finish : number ) : number;
    ShuffleList<T>(listToShuffle : Array<T>) : Array<T>;
}

export interface IRquery {
    CreateFolder: (folderName : string, parentObjectInstance : Instance) => Folder
    FindSiblingNamed: (part : Instance, siblingName : string) => Instance
    DeepCopyTable: (orig : Table) => Table;
    GetPersonageOrPlayerHumanoidOrNil: (personageOrPlayer : Instance) => Humanoid
    GetPlayerFromCharacterOrDescendant: (descendantCharacter : Instance) => Player
    GetPlayerDrivingVehicle: (vehicleModel : Model) => Player
    PersonageTorsoOrEquivalent: (personage : Model) => Part
    GetHumanoid: (descendantPart : Instance) => Humanoid
    AttachedHumanoidOrNil: (part : Part) => Humanoid
    AttachedCharacterOrNil: (part : Part) => Model
    GetUserIdString: (player : Player) => string
    GetUserIdFromCharacter: (character: Model) => string
    GetPlayerFromUserId: (userId:string) => Player
    GetCharacterFromUserId: (userId: string) => Model
    ForceUnseatHumanoid: (humanoid : Humanoid) => void
    FolderContentsOrNil: (folderName : string, parent : Instance) => Array<Instance>
    ComponentsFolderOrNil: (item : Instance) => Array<Instance>
    StringValueOrNil: (valueName : string, parent : Instance) => string
    BoolValueOrNil: (valueName : string, parent : Instance) => string
    ObjectValueOrNil: (valueName : string, parent : Instance) => Instance
    IntValueOrNil: (valueName : string, parent : Instance) => number
    GetOrAddItem: (itemName: string, itemType: string, parent: Instance) => Instance
    GetOrAddEntityId: (item : Instance) => string
    Assign: ( target : Table, ... sourceThings : any[]) => Table
}

export interface IWraptor {
    DEPRECATED: (func : (...args : any[]) => any, funcName : string, reason : string) 
        => (...args : any[]) => any;
    TryCatch: (funcTry : (...args : any[]) => any, catchFunc : (err : any) => any)
        => any;
    xpcall: (call : (...args : any[]) => any, handler : (err : any) => any) 
        => any;
    WithCoolDown: (coolDownTime : number, func : (...args : any[]) => any)
        => any;
}

export interface IUuid {
    seed : () => void;
    randomseed : (seed: number) => number;
}

export interface IQueue<TElement> {
    Enqueue(value : TElement) : void;
    Dequeue() : TElement;
    Front() : TElement;
    Back() : TElement;
    Length() : number;
}