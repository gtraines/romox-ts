
import { ICategorySpawner, ISpawnerArtifact, IVehicleCategorySpawner } from './SpawnerTypings';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';
import { NpcCategorySpawner } from './NpcCategorySpawner';

const vehicleSpawnerModule = ServerScriptService.WaitForChild("PlayerInterest").WaitForChild("VehicleCategorySpawner") as ModuleScript;
const VehicleCategorySpawner = require(vehicleSpawnerModule) as IVehicleCategorySpawner;
const _ = require(ReplicatedStorage.WaitForChild("NevermoreResources").WaitForChild("Modules").WaitForChild("rodash") as ModuleScript)

export interface ISpawnerManager {
    Init() : void;
    ConfigureSpawners() : void;
    CategorySpawners : Array<ICategorySpawner>;
}

export class SpawnerManager implements ISpawnerManager {
    constructor() {
        this.CategorySpawners = new Array<ICategorySpawner>();
    }
    Init(): void {
        this.CategorySpawners = new Array<ICategorySpawner>();
        this.CategorySpawners.push(VehicleCategorySpawner);
        this.CategorySpawners.push(new NpcCategorySpawner())
        this.ConfigureSpawners();
    }    
    ConfigureSpawners(): void {
        this.CategorySpawners.forEach(spawner => {
            spawner.ConfigureSpawners();
        });
    }
    CategorySpawners: ICategorySpawner[];
}