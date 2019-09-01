import { ICategorySpawner, ISpawnerArtifact } from './SpawnerTypings';

export class SoldierCategorySpawner implements ICategorySpawner {
    constructor() {
        this.Spawners = new Array<ISpawnerArtifact>();
        this.SpawnersFolder = "SoldierSpawners";
        this.SpawnsCategory = "MaleHumanoids";
        this.ServerStorageFolder = ""
        this.GetSpawnerModels = (categoryName : string) => {
            let spawnerModels = game.Workspace.WaitForChild("Spawners").WaitForChild("SoldierSpawners").GetChildren();
            
            return spawnerModels as Array<Model>;
        }
        this.ConfigureSpawners = () => {

        }
    }
    SpawnsCategory: string;
    SpawnersFolder: string;
    ServerStorageFolder: string;
    Spawners: ISpawnerArtifact[];
    ConfigureSpawners: () => void;
    GetSpawnerModels: (categoryName: string) => Model[];
}