import { IGameModel, GameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IFactionable, Factionable } from '../../../ReplicatedStorage/ToughS/ComponentModel/FactionTypes';
export interface ITransportObjective extends IGameModel {
    WireUpHandlers(): Array<RBXScriptConnection>;
    GetOnTouchedHandler() : (otherPart : BasePart) => void
    Factions : IFactionable
    TouchedConnection? : RBXScriptConnection
}

export class TransportObjective 
    extends GameModel 
    implements ITransportObjective {
    
    constructor(gameModel : Model) {
        super(gameModel)

        this.Factions = new Factionable()
        if (this.GetComponentStringValue("Faction") !== undefined) {
            this.Factions.AddFaction(this.GetComponentStringValue("Faction"))
        }

    }
    WireUpHandlers(): RBXScriptConnection[] {
        let scriptConnections = new Array<RBXScriptConnection>()
        
        let flagBase = this.ModelInstance.PrimaryPart

        return scriptConnections
    }
    GetOnTouchedHandler(): (otherPart: BasePart) => void {
        let handler = (otherPart: BasePart) => {

        }

        return handler
    }
    Factions : IFactionable
    TouchedConnection?: RBXScriptConnection | undefined;
}