import { IGameModel, GameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IFactionable, IFactionComponent, FactionComponent } from '../../Components/Factions/Factionable'
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';

const rq =  requireScript<IRquery>("rquery")

export interface ITransportObjective extends IGameModel, IFactionable {
    WireUpHandlers(): Array<RBXScriptConnection>;
    GetOnTouchedHandler() : (otherPart : BasePart) => void
    TouchedConnection? : RBXScriptConnection
    CharacterTouchedObjectiveCallback? : 
        (character : Model, objective : ITransportObjective) => void
}

export class TransportObjective 
    extends GameModel 
    implements ITransportObjective {
    
    constructor(gameModel : Model) {
        super(gameModel)
        // Look!
        this.FactionTracker = new FactionComponent() as IFactionComponent

        this.FactionTracker.LoadFromCommaSeparatedString(
            this.GetComponentStringValue("Factions"))
        
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
    FactionTracker : IFactionComponent
    TouchedConnection?: RBXScriptConnection | undefined
    CharacterTouchedObjectiveCallback? : 
        (character : Model, objective : ITransportObjective) => void
}