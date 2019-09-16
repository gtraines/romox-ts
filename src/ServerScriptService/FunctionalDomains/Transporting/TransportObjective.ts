import { IGameModel, GameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IFactionable, Factionable } from '../../../ReplicatedStorage/ToughS/ComponentModel/FactionTypes';
import { ITransportableArtifact } from './TransportableArtifact';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';

const rq =  requireScript("rquery") as IRquery

export interface ITransportObjective extends IGameModel {
    WireUpHandlers(): Array<RBXScriptConnection>;
    GetOnTouchedHandler() : (otherPart : BasePart) => void
    Factions : IFactionable
    TouchedConnection? : RBXScriptConnection
    ArtifactTouchedObjectiveCallback? : (artifact : ITransportableArtifact, objective : ITransportObjective) => void
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
            // Either the artifact directly or someone carrying it
            // otherPart : belongs to x
            let attachedCharacter = rq.AttachedCharacterOrNil(otherPart as Part)
            if (attachedCharacter !== undefined) {
                let attachedPlayer = rq.GetPlayerFromCharacterOrDescendant(attachedCharacter)
                if (attachedPlayer !== undefined) {
                    
                }
            }
            // Cool down
            wait(0.2)
        }

        return handler
    }
    Factions : IFactionable
    TouchedConnection?: RBXScriptConnection | undefined;
}