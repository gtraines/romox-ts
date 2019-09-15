import { IGameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
export interface ITransportObjective extends IGameModel {
    WireUpHandlers(): Array<RBXScriptConnection>;
}
