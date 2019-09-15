import { Workspace, Players } from '@rbxts/services';
import { IGameModel, GameModel } from '../ComponentModel/FundamentalTypes';
import { IPersonageCrawler, PersonageCrawler } from './PersonageCrawler';
import { IRquery } from '../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../ScriptLoader';


const rq = requireScript("rquery") as IRquery
const personageCrawler = new PersonageCrawler() as IPersonageCrawler

export enum PersonageRigType {
    R6 = 0,
    R15 = 1
}

export interface IPersonage extends IGameModel{
    IsPlayer : boolean
    Humanoid : Humanoid
    RootPart : BasePart
    Torso : Part
    RigType : PersonageRigType
}

export class Personage extends GameModel implements IPersonage {
    
    constructor(characterInstance : Model) {
        super(characterInstance)
        this.IsPlayer = personageCrawler.IsPersonagePlayer(characterInstance)
        this.Humanoid = personageCrawler.GetHumanoid(characterInstance)
        this.Torso = rq.PersonageTorsoOrEquivalent(characterInstance)
        if (personageCrawler.IsPersonageR6(characterInstance)) {
            this.RigType = PersonageRigType.R6
        } else {
            this.RigType = PersonageRigType.R15
        }
        this.RootPart = personageCrawler.GetRootPart(characterInstance)
    }
    IsPlayer: boolean;
    Humanoid: Humanoid;
    Torso: Part
    RootPart: BasePart;
    RigType : PersonageRigType
}