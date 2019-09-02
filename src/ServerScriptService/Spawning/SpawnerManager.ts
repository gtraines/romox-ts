
import { ICategorySpawner, ISpawnerArtifact, IVehicleCategorySpawner } from './SpawnerTypings';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';
import { NpcCategorySpawner } from './NpcCategorySpawner';
import { IConfigManager } from '../GameModules/GameModulesTypings';
const configManagerModule = ServerScriptService.WaitForChild("GameModules").WaitForChild("ConfigManager") as ModuleScript;
const configManager = require(configManagerModule) as IConfigManager;

const vehicleSpawnerModule = ServerScriptService.WaitForChild("Spawning").WaitForChild("VehicleCategorySpawner") as ModuleScript;
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
        if (configManager.GetFeatureEnabled("UseVehicleSpawners")) {
            this.CategorySpawners.push(VehicleCategorySpawner);
        }
        if (configManager.GetFeatureEnabled("UseNpcSpawners")) {
            this.CategorySpawners.push(new NpcCategorySpawner())
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