
import { ICategorySpawner, ISpawnerArtifact, IPersonageSpawner } from '../SpawnerTypings';
import { NpcCategorySpawner } from './NpcCategorySpawner';
import { Workspace } from '@rbxts/services';

export class SoldierCategorySpawner 
    extends NpcCategorySpawner implements ICategorySpawner {
    constructor() {
        super()
        this.SpawnerModelName = "SoldierSpawner"
    }
    SpawnerModelName : string
    ConfigureSpawnerArtifact(spawnerArtifact : ISpawnerArtifact) : ISpawnerArtifact {
        let spawnedItemFolder = this.SpawnsCategory

        this.PersonageSpawner.SpawnMaleHumanoid(
            spawnerArtifact.SpawnsPrototypeId, 
            spawnerArtifact.SpawnsAtCFrame, 
            function(createdPersonage: Model) {
                createdPersonage.Parent = Workspace.WaitForChild(spawnedItemFolder)
                print("Great job ", createdPersonage.Name)
            })
        return spawnerArtifact
    }
}