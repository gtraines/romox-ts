import { ISpawnerArtifact } from './SpawnerTypings';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { ReplicatedStorage } from '@rbxts/services';

const rqModule = ReplicatedStorage.WaitForChild("NevermoreResources").WaitForChild("Modules").WaitForChild("rquery") as ModuleScript;
const rq = require(rqModule) as IRquery

export class SpawnerArtifact implements ISpawnerArtifact {
    constructor(spawnerModel: Model, spawnCooldownTime: number = 6) {
        this.SpawnsPrototypeId = rq.StringValueOrNil("SpawnsPrototypeId", spawnerModel)
        this.SpawnPad = spawnerModel.FindFirstChild("SpawnPad") as Part
        this.SpawnsAtCFrame = (new CFrame(this.SpawnPad.Position).add(new Vector3(0, 3, 0))) as CFrame
        this.SpawnCooldownTime = spawnCooldownTime;
    }
    SpawnPad: Part;
    SpawnsAtCFrame: CFrame;
    SpawnsPrototypeId: string;    
    SpawnCooldownTime: number;
}