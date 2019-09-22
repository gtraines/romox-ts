import { IGameModel, GameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IFactionable, Factionable } from '../../../ReplicatedStorage/ToughS/ComponentModel/FactionTypes';
import { ITransportableArtifact } from './TransportableArtifact';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';

const rq =  requireScript<IRquery>("rquery")

export interface ITransportObjective extends IGameModel {
    WireUpHandlers(): Array<RBXScriptConnection>;
    GetOnTouchedHandler() : (otherPart : BasePart) => void
    Factions : IFactionable
    TouchedConnection? : RBXScriptConnection
    CharacterTouchedObjectiveCallback? : 
        (character : Model, objective : ITransportObjective) => void
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
        this.WireUpHandlers()

    }
    WireUpHandlers(): RBXScriptConnection[] {
        let scriptConnections = new Array<RBXScriptConnection>()
        
        let flagBase = this.ModelInstance.PrimaryPart as BasePart
        this.TouchedConnection = flagBase.Touched.Connect(this.GetOnTouchedHandler())
        scriptConnections.push(this.TouchedConnection)
        return scriptConnections
    }
    GetOnTouchedHandler(): (otherPart: BasePart) => void {
        let handler = (otherPart: BasePart) => {
            
            let attachedCharacter = rq.AttachedCharacterOrNil(otherPart as Part)
            if (attachedCharacter !== undefined &&
                this.CharacterTouchedObjectiveCallback !== undefined) {
                this.CharacterTouchedObjectiveCallback(attachedCharacter, this)
            }
            // Cool down
            wait(0.2)
        }

        return handler
    }
    Factions : IFactionable
    TouchedConnection?: RBXScriptConnection | undefined
    CharacterTouchedObjectiveCallback? : 
        (character : Model, objective : ITransportObjective) => void
}