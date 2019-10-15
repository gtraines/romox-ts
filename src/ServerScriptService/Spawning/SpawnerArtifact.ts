import { ISpawnerArtifact } from './SpawnerTypings';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';
const loader = require(ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript) as (module : string) => any
const rq = loader("rquery") as IRquery

export class SpawnerArtifact implements ISpawnerArtifact {
    constructor(spawnerModel: Model, spawnCooldownTime: number = 6) {
        this.SpawnsPrototypeId = rq.StringValueOrNil("SpawnsPrototypeId", spawnerModel)
        this.SpawnPad = spawnerModel.FindFirstChild("SpawnPad") as Part
        this.SpawnsAtCFrame = (new CFrame(this.SpawnPad.Position).add(new Vector3(0, 3, 0))) as CFrame
        this.SpawnCooldownTime = spawnCooldownTime;
    }
    SpawnPad: Part;
    SpawnsAtCFrame: CFrame;
    SpawnCooldownTime: number;
    SpawnsPrototypeId: string;
}