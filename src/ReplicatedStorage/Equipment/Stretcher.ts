import { IRquery } from '../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { IPersonageShoulders, 
    PersonageArms, 
    IPersonageArms, 
    PersonageShoulders, 
    IPersonageCrawler,
    PersonageCrawler } from '../../ReplicatedStorage/ToughS/StandardLib/PersonageCrawler';

const rq = requireScript("rquery") as IRquery
const personageCrawler = new PersonageCrawler() as IPersonageCrawler

export interface IStretcherTool {
    ConnectToEvents(toolModel : Model) : Model;
    AttachToModel(toolModel : Model) : void;
    Equip(mouse: any) : void;
    Unequip(mouse: any) : void;

}

export class StretcherTool implements IStretcherTool {
    constructor(toolModel : Model) {
        this.ToolModel = toolModel;
        this._tool = toolModel.FindFirstChildWhichIsA("Tool") as Tool;
        this._welds = new Array<Weld>();
        this._attachedPersonageArms = new PersonageArms();
        this._attachedPersonageShoulders = new PersonageShoulders()
    }
    ToolModel : Model;
    _tool : Tool;
    _attachedPersonageShoulders : IPersonageShoulders;
    _attachedPersonageArms : IPersonageArms;
    _welds : Weld[];
    _equipEventConnection? : RBXScriptConnection;
    _unequipEventConnection? : RBXScriptConnection;
    ConnectToEvents(toolModel: Model) : Model {
        
        return toolModel;
    }
    AttachToModel(toolModel: Model) : void {

    }
    AttachToPersonage(personage: Model) : void {
        // Get the pieces of them we need
        this._attachedPersonageArms = personageCrawler.GetArms(personage)
        this._attachedPersonageShoulders = personageCrawler.GetShoulders(personage)
        if (this._attachedPersonageArms !== undefined) {
            let shoulders = this._attachedPersonageShoulders
            let arms = this._attachedPersonageArms
            let leftWeld = this._weldArmToTool(personage, shoulders.Left as Motor6D, arms.Left as Part)
            let rightWeld = this._weldArmToTool(personage, shoulders.Right as Motor6D, arms.Right as Part)
            leftWeld.C1 = new CFrame(-0.5, 0.5, 1.5).mul(CFrame.fromEulerAnglesXYZ(math.rad(270), 0, math.rad(-90))) 
            rightWeld.C1 = new CFrame(-1.5, 0.5, 0.5).mul(CFrame.fromEulerAnglesXYZ(math.rad(-90), math.rad(0), 0))
        }

    }
    _weldArmToTool(personage : Model, shoulder : Motor6D, arm : Part) : JointInstance {
        shoulder.Part1 = undefined
        let weld = new Instance("Weld")
        let torso = rq.PersonageTorsoOrEquivalent(personage)
        weld.Part0 = torso
        weld.Parent = torso
        weld.Part1 = arm

        return weld
    }
    Equip(mouse: any) : void {
        
    }
    Unequip(mouse: any) : void {

    }
    _weldToPersonage(personage : Model) : void {

    }
    _unweldFromPersonage(personage : Model) : void {

    }
    _getPersonageShoulders(personage : Model) : Instance[] {
        return new Array<Instance>();
    }
}