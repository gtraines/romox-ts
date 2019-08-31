export interface ISpawnerArtifact {
    SpawnsPrototypeId : string;
    SpawnCooldownTime : number;
}

export interface ICategorySpawner {
    SpawnsCategory : string;
    SpawnersFolder : string;
    ServerStorageFolder : string;
    Spawners : Array<ISpawnerArtifact>;
    ConfigureSpawners: () => void;
    GetSpawnerModels: (categoryName : string) => Array<Model>;
}

export interface IVehicleCategorySpawner extends ICategorySpawner {
    TouchedByAPlayerClosure: 
        (spawnerModel : Model, 
        touchedByPlayerDelegate : () => void) => (part : Part) => void;
}