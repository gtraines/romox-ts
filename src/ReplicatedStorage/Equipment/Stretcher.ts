import { IRquery } from '../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../ToughS/ScriptLoader';
import { IPersonageShoulders, 
    PersonageArms, 
    IPersonageArms, 
    PersonageShoulders, 
    PersonageCrawler } from '../ToughS/StandardLib/PersonageCrawler';

const rq = requireScript("rquery") as IRquery

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
        this._attachedPersonageArms = PersonageCrawler
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