
import { ICategorySpawner, ISpawnerArtifact, IVehicleCategorySpawner } from './SpawnerTypings';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';
import { NpcCategorySpawner } from './NpcSpawners/NpcCategorySpawner';
import { GameConfigService } from '../Config/GameConfigService';
import { SoldierCategorySpawner } from './NpcSpawners/SoldierCategorySpawner';

const vehicleSpawnerModule = ServerScriptService.WaitForChild("Spawning").WaitForChild("VehicleCategorySpawner") as ModuleScript;
const VehicleCategorySpawner = require(vehicleSpawnerModule) as IVehicleCategorySpawner;
// Rodash
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
        if (GameConfigService.GetFeatureEnabled("UseVehicleSpawners")) {
            this.CategorySpawners.push(VehicleCategorySpawner);
        }
        if (GameConfigService.GetFeatureEnabled("UseNpcSpawners")) {
            print("USING NPC SPAWNERS")
            print("PUSHING SOLDIER CAT SPAWNER")
            this.CategorySpawners.push(new SoldierCategorySpawner())
        }
        
        this.ConfigureSpawners();
    }    
    ConfigureSpawners(): void {
        this.CategorySpawners.forEach(spawner => {
            spawner.ConfigureSpawners();
        });
    }
    CategorySpawners: ICategorySpawner[];
}