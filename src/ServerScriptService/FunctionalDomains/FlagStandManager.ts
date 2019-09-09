import { ReplicatedStorage, ServerStorage, CollectionService } from "@rbxts/services"
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';

const rq = requireScript("rquery") as IRquery

export interface ISuckAtFighting {
    Init(containingFolder : string) : void
}

export interface ITransportObjective {
    EntityId : string
    PrototypeId : string
    ObjectiveModel : Model
    WireUpHandlers() : Array<RBXScriptConnection>
    OnPickedUp : (retrievingPlayer : Player, objectiveInstance : Model) => void
    OnCarrierDied : (deadCarrier : Player, objectiveInstance : Model) => void
    DestroyObjective() : void
}

export class CtfFlagObjective implements ITransportObjective {
    constructor(objectiveModel : Model) {
        this.EntityId = rq.GetOrAddEntityId(objectiveModel)
        let prototypeIdValue = rq.GetOrAddItem("PrototypeId", "StringValue", objectiveModel) as StringValue
        this.PrototypeId = prototypeIdValue.Value
        this.ObjectiveModel = objectiveModel
        
    }
    EntityId: string;
    PrototypeId: string;
    ObjectiveModel: Model;
    WireUpHandlers(): RBXScriptConnection[] {
        throw "Method not implemented.";
    }
    OnPickedUp: (retrievingPlayer: Player, objectiveInstance: Model) => void;
    OnCarrierDied: (deadCarrier: Player, objectiveInstance: Model) => void;
    DestroyObjective(): void {
        throw "Method not implemented.";
    }
    
}

export interface ITransportObjectiveManager {
    GameConfig : Array<any>
    Init(containingFolder : string) : void
}

export interface CtfObjectiveManager extends ITransportObjectiveManager {
    FlagObjects : Array<Model>
    FlagCarriers : Array<Player>
    CaptureFlag : RemoteEvent
    ReturnFlag : RemoteEvent
}

