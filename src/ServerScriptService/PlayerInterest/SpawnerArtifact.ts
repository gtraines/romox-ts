import { ISpawnerArtifact } from './SpawnerTypings';

export class SpawnerArtifact implements ISpawnerArtifact {
    constructor(spawnerModel: Model, spawnCooldownTime: number = 6) {
        this.SpawnsPrototypeId = "";
        let spawnerPieces = spawnerModel.GetDescendants() as Array<Instance>;
        
    }
    SpawnsPrototypeId: string;    
    SpawnCooldownTime: number;

}