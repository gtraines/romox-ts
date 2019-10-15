export interface ISpawnerArtifact {
    SpawnsPrototypeId : string;
    SpawnCooldownTime : number;
    SpawnPad: Part;
    SpawnsAtCFrame: CFrame;
}

export interface ICategorySpawner {
    SpawnsCategory : string;
    SpawnersSubFolderName : string;
    ServerStorageFolder : string;
    Spawners : Array<ISpawnerArtifact>;
    ConfigureSpawners() : void
    GetSpawnerSubFolderContents(spawnerModelName: string) : Array<Model>
}

export interface IPersonageSpawner {
    ChooseRandomSpawnLocation: () => CFrame;
    SpawnPersonage: (storageFolder : string, 
        personagePrototypeId : string, 
        spawnLocation: CFrame, 
        onSpawnCompleteCallback: (personage: Model) => void) 
        => void;
    SpawnMaleHumanoid: (personagePrototypeId: string, 
        spawnLocation: CFrame, 
        onSpawnCompleteCallback: (createdPersonage: Model) => void) => void;
    SpawnFemaleHumanoid: (personagePrototypeId: string, 
            spawnLocation: CFrame, 
            onSpawnCompleteCallback: (createdPersonage: Model) => void) => void;
    FindRandomZombie: () => Model;
    GetRandomZombieRootPart: () => Part;
    CreateRunner: (gender: string, npcName: string, personagePrototypeId: string) => void;
    CreateFemaleRunner: () => void;
    CreateMaleRunner: () => void;
}

export interface IVehicleCategorySpawner extends ICategorySpawner {
    TouchedByAPlayerClosure: 
        (spawnerModel : Model, 
        touchedByPlayerDelegate : () => void) => (part : Part) => void;
}