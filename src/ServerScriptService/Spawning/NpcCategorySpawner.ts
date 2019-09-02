import { ICategorySpawner, ISpawnerArtifact, IPersonageSpawner } from './SpawnerTypings';
import { Workspace, ServerScriptService, ReplicatedStorage } from '@rbxts/services';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { SpawnerArtifact } from './SpawnerArtifact';

const personageSpawnerModule = ServerScriptService.WaitForChild("Spawning").WaitForChild("PersonageSpawner") as ModuleScript
const personageSpawner = require(personageSpawnerModule) as IPersonageSpawner

const rqModule = ReplicatedStorage.WaitForChild("NevermoreResources").WaitForChild("Modules").WaitForChild("rquery") as ModuleScript;
const rq = require(rqModule) as IRquery

export class NpcCategorySpawner implements ICategorySpawner {
    /**
     * Responsible for spawning NPCs
     */
    constructor() {
        this.SpawnersFolder = "NpcSpawners";
        this.ServerStorageFolder = "MaleHumanoids"
        this.Spawners = new Array<ISpawnerArtifact>();
        this.SpawnsCategory = "Npcs";
    }
    SpawnsCategory :string;
    SpawnersFolder: string;
    ServerStorageFolder: string;
    Spawners: ISpawnerArtifact[];
    ConfigureSpawners() {
        let spawnerModels = this.GetSpawnerModels()
        spawnerModels.forEach(entry => {
            let parsedArtifact = new SpawnerArtifact(entry)
            if (parsedArtifact !== undefined) {
                this.Spawners.push(parsedArtifact);
            }
        });

        this.Spawners.forEach(element => {
            personageSpawner.SpawnMaleHumanoid(element.SpawnsPrototypeId, 
                element.SpawnsAtCFrame, 
                function(createdPersonage: Model) {
                    createdPersonage.Parent = Workspace.WaitForChild("Npcs")
                    print("Great job ", createdPersonage.Name)
                })
        });

        return;
    }
    GetSpawnerModels(categoryName: string = "")  {
        let spawnerFolder = Workspace.WaitForChild("Spawners")
        let folderContents = rq.FolderContentsOrNil(this.SpawnersFolder, spawnerFolder)
        
        if (folderContents !== undefined && folderContents.size() > 0) {
            folderContents.filter(function(entry:Instance) {
                return entry.IsA("Model");
            })
        }

        return folderContents as Model[];
    }
}