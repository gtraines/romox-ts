import { ICategorySpawner, ISpawnerArtifact, IPersonageSpawner } from '../SpawnerTypings';
import { Workspace, ServerScriptService, ReplicatedStorage } from '@rbxts/services';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { SpawnerArtifact } from '../SpawnerArtifact';

const personageSpawnerModule = ServerScriptService.WaitForChild("Spawning").WaitForChild("PersonageSpawner") as ModuleScript

const rqModule = ReplicatedStorage.WaitForChild("NevermoreResources").WaitForChild("Modules").WaitForChild("rquery") as ModuleScript;
const rq = require(rqModule) as IRquery

export abstract class NpcCategorySpawner implements ICategorySpawner {
    /**
     * Responsible for spawning NPCs
     */
    constructor() {
        this.SpawnersSubFolderName = "NpcSpawners";
        this.ServerStorageFolder = "Humanoids"
        this.SpawnsCategory = "Npcs"
        this.Spawners = new Array<ISpawnerArtifact>();
        this.PersonageSpawner = require(personageSpawnerModule) as 
            IPersonageSpawner
    }
    abstract SpawnerModelName: string
    PersonageSpawner : IPersonageSpawner
    SpawnsCategory: string
    SpawnersSubFolderName: string;
    ServerStorageFolder: string;
    Spawners: ISpawnerArtifact[];
    abstract ConfigureSpawnerArtifact(spawnerArtifact : ISpawnerArtifact) : ISpawnerArtifact
    ConfigureSpawners() {
        let spawnerModels = this.GetSpawnerSubFolderContents(
            this.SpawnerModelName
        )

        spawnerModels.forEach(entry => {
            let parsedArtifact = new SpawnerArtifact(entry)
            if (parsedArtifact !== undefined) {
                this.Spawners.push(parsedArtifact);
            }
        });

        this.Spawners.forEach(artifact => {
            this.ConfigureSpawnerArtifact(artifact)
        });

        return;
    }
    GetSpawnerSubFolderContents(spawnerModelName: string) : Array<Model> {
        let spawnerModels = new Array<Model>()
        let spawnerFolder = Workspace.WaitForChild("Spawners")
        let spawnerSubFolderContents = rq.FolderContentsOrNil(
            this.SpawnersSubFolderName, 
            spawnerFolder)
        
        if (spawnerSubFolderContents !== undefined && 
            spawnerSubFolderContents.size() > 0) {
                spawnerModels = spawnerSubFolderContents.filter(
                    function(entry:Instance) {
                        return entry.IsA("Model") && 
                            entry.Name === spawnerModelName;
            }) as Array<Model>
        }
        
        return spawnerModels
    }
}