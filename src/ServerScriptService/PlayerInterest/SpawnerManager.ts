
import { ICategorySpawner, ISpawnerArtifact, IVehicleCategorySpawner } from './SpawnerTypings';
import { ServerScriptService } from '@rbxts/services';

const vehicleSpawnerModule = ServerScriptService.WaitForChild("PlayerInterest").WaitForChild("VehicleCategorySpawner") as ModuleScript;
const VehicleCategorySpawner = require(vehicleSpawnerModule) as IVehicleCategorySpawner;

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
        this.ConfigureSpawners();
    }    
    ConfigureSpawners(): void {
        this.CategorySpawners.forEach(spawner => {
            spawner.ConfigureSpawners();
        });
    }
    CategorySpawners: ICategorySpawner[];
}