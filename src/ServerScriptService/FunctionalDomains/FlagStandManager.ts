import { ReplicatedStorage, ServerStorage, CollectionService } from "@rbxts/services"
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { IGameModel, GameModel } from '../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';

const rq = requireScript("rquery") as IRquery

export interface ITransportObjective extends IGameModel {
    WireUpHandlers() : Array<RBXScriptConnection>
    GetOnPickedUpHandler() : (player : Player) => void
    GetOnCarrierDiedHandler() : (player : Player) => void

    DestroyObjective() : void
}

export class CtfFlagObjective extends GameModel implements ITransportObjective {
    constructor(gameModel : Model) {
        super(gameModel)
    }
    WireUpHandlers(): RBXScriptConnection[] {
        throw "Method not implemented.";
    }
    GetOnPickedUpHandler() {
        let handler = (player : Player) => {

        }

        return handler
    }
    GetOnCarrierDiedHandler() {
        let handler = (player : Player) => {

        }
        return handler
    }
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

