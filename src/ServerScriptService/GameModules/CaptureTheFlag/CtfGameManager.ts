import { IGameManager, IMapManager } from '../GameModulesTypings';
import { GameState, IGameState } from '../GameState';

import { GameManagerBase } from '../GameManagerBase';
import { ReplicatedStorage, ServerScriptService } from '@rbxts/services';

import { GameConfigKeys, FeatureFlagKeys } from '../../Config/ConfigManager';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { GameConfigService } from '../../Config/GameConfigService';


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
    GameRunning : boolean
    IntermissionRunning : boolean
    EnoughPlayers : boolean

    constructor() {
        super()
        this.CaptureFlag = rq.GetOrAddItem("CaptureFlag", "BindableEvent", Events) as BindableEvent
        this.ReturnFlag = rq.GetOrAddItem("ReturnFlag", "BindableEvent", Events) as BindableEvent
        
        this.Initialize()
        this.GameRunning = false
        this.IntermissionRunning = false
        this.EnoughPlayers = false
    }
    Initialize(): void {
        
        if (GameConfigService.GetFeatureEnabled(FeatureFlagKeys.UseSaveMap)) {
            MapManager.SaveMap()
        }
        if (GameConfigService.GetFeatureEnabled(FeatureFlagKeys.IsCaptureTheFlag)) {
            this.CaptureFlag.Event.Connect(this.GetOnCaptureFlagHandler())
            this.ReturnFlag.Event.Connect(this.GetOnReturnFlagHandler())
        }
        
    }
    GetCurrentGameState(): IGameState {
        
        let overallState = new GameState(
            this.GameRunning,
            this.IntermissionRunning,
            this.EnoughPlayers
        )

        return overallState
    }
    RunIntermission(): void {
        this.IntermissionRunning = true
    }
    StopIntermission(): void {
        this.IntermissionRunning = false
    }
    BeforeGameStart(): void {
        
    }
    GameReady(): boolean {
        throw "Method not implemented.";
    }
    BeforeRoundStart(): void {
        this.GameRunning = false
        this.EnoughPlayers = false
    }
    StartRound(): boolean {
        this.GameRunning = true
        this.IntermissionRunning = false
        this.EnoughPlayers = true

        return true
    }
    Update(): void {
        
    }
    RoundOver(): boolean {

        this.GameRunning = false
        this.IntermissionRunning = true

        return true
    }
    RoundCleanup(): void {
        this.GameRunning = false
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