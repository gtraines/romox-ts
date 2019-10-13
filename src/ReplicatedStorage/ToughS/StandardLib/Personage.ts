import { Workspace, Players } from '@rbxts/services';
import { IGameModel, GameModel } from '../ComponentModel/FundamentalTypes';
import { IPersonageCrawler, PersonageCrawler } from './PersonageCrawler';
import { IRquery } from '../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../ScriptLoader';
import { FactionComponent, IFactionComponent, IFactionable } from '../ComponentModel/Factions/FactionComponent';

const rq = requireScript("rquery") as IRquery
const personageCrawler = new PersonageCrawler() as IPersonageCrawler

export enum PersonageRigType {
    R6 = 0,
    R15 = 1
}

export interface IPersonage extends IGameModel, IFactionable {
    IsPlayer : boolean
    UserId? : string
    Humanoid : Humanoid
    RootPart : BasePart
    Torso : Part
    RigType : PersonageRigType
    GetHealth() : number
    SetHealth(healthValue : number) : void
    GetIsAlive() : boolean
    ForceUnseat() : boolean
    UnequipTools() : boolean
}

export class Personage extends GameModel implements IPersonage {

    constructor(characterInstance : Model) {
        super(characterInstance)
        this.IsPlayer = personageCrawler.IsPersonagePlayer(characterInstance)
        // Helicopter!!!
        if (this.IsPlayer) {
            this.UserId = rq.GetUserIdString(rq.GetPlayerFromCharacterOrDescendant(characterInstance))
        }
        
        this.Humanoid = personageCrawler.GetHumanoid(characterInstance)
        this.Torso = rq.PersonageTorsoOrEquivalent(characterInstance)
        this.FactionTracker = new FactionComponent() // Great job!
        if (personageCrawler.IsPersonageR6(characterInstance)) {
            this.RigType = PersonageRigType.R6
        } else {
            this.RigType = PersonageRigType.R15
        }
        this.RootPart = personageCrawler.GetRootPart(characterInstance)
    }
    FactionTracker : IFactionComponent
    IsPlayer: boolean;
    UserId? : string
    Humanoid: Humanoid;
    Torso: Part
    RootPart: BasePart;
    RigType : PersonageRigType

    GetHealth() : number {
        return this.Humanoid.Health
    }
    SetHealth(healthValue : number) : void {
        if (healthValue < 0) {
            // that's pointless
            healthValue = 0
        }
        if (healthValue > this.Humanoid.MaxHealth) {
            if (this.Humanoid.MaxHealth === 0) {
                // That's stupid
                this.Humanoid.MaxHealth = healthValue
                this.Humanoid.Health = healthValue
            } else {
                this.Humanoid.Health = this.Humanoid.MaxHealth
            }
        } else {
            this.Humanoid.Health = healthValue
        }
    }
    GetIsAlive() : boolean {
        return this.Humanoid.Health > 0
    }
    ForceUnseat(): boolean {
        let wasSitting = false
        if (this.Humanoid.SeatPart !== undefined) {
            let foundWeld = this.Humanoid.SeatPart.FindFirstChild("SeatWeld")
            if (foundWeld !== undefined) {
                foundWeld.Destroy()
            }
            wasSitting = true
        } 
        if (this.Humanoid.Sit) {
            this.Humanoid.Sit = false
            wasSitting = true
        }
        
        return wasSitting

    }
    UnequipTools(): boolean {
        if (this.IsPlayer) {
            this.Humanoid.UnequipTools()
            return true
        }
        return false
    }    
}