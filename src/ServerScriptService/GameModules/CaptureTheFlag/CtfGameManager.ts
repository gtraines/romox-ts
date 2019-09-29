import { IGameManager, IMapManager } from '../GameModulesTypings';
import { GameManagerBase } from '../GameManagerBase';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';
import { ConfigManager, IConfigManager, GameConfigKeys, FeatureFlagKeys } from '../ConfigManager';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';


const rq = requireScript<IRquery>("rquery")
const Events = rq.GetOrAddItem("Events", "Folder", ReplicatedStorage)

const GameModulesFolder = ServerScriptService.FindFirstChild("GameModules") as Folder
const CtfFolder = GameModulesFolder.FindFirstChild("CaptureTheFlag") as Folder

const MapManager = require(
    CtfFolder.FindFirstChild("CtfMapManager") as ModuleScript
    ) as IMapManager

export class CtfGameManager extends GameManagerBase implements IGameManager {
    CaptureFlag : BindableEvent
    ReturnFlag : BindableEvent
    constructor() {
        super()
        this.CaptureFlag = rq.GetOrAddItem("CaptureFlag", "BindableEvent", Events) as BindableEvent
        this.ReturnFlag = rq.GetOrAddItem("ReturnFlag", "BindableEvent", Events) as BindableEvent
        
        this.Initialize()
    }
    Initialize(): void {
        if (!this.ConfigManager.Loaded) {
            this.ConfigManager.Init()
        }
        if (
            this.ConfigManager.GetFeatureEnabled(FeatureFlagKeys.UseSaveMap)
            ) {
            MapManager.SaveMap()
        }
        if (this.ConfigManager.GetFeatureEnabled(FeatureFlagKeys.IsCaptureTheFlag)) {
            this.CaptureFlag.Event.Connect(this.GetOnCaptureFlagHandler())
            this.ReturnFlag.Event.Connect(this.GetOnReturnFlagHandler())
        }
    }
    RunIntermission(): void {
        throw "Method not implemented.";
    }
    StopIntermission(): void {
        throw "Method not implemented.";
    }
    GameReady(): boolean {
        throw "Method not implemented.";
    }
    StartRound(): boolean {
        throw "Method not implemented.";
    }
    Update(): void {
        throw "Method not implemented.";
    }
    RoundOver(): boolean {
        throw "Method not implemented.";
    }
    RoundCleanup(): void {
        throw "Method not implemented.";
    }

    GetOnCaptureFlagHandler() : (player : Player) => void {
        let handler = (player: Player) => {

        }
        return handler
    }

    GetOnReturnFlagHandler() : (player : Player) => void {
        let handler = (player: Player) => {

        }
        return handler
    }
}