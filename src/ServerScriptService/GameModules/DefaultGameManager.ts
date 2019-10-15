import { ServerScriptService, Players } from '@rbxts/services';
import { GameManagerBase } from "./GameManagerBase";
import { GameConfigService } from '../Config/GameConfigService';
import { IGameState, GameState } from './GameState';
import { IGameManager, IMapManager } from './GameModulesTypings';
import { Spieler } from '../FunctionalDomains/Spieler';
import { Personage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IPersonageSpawner } from '../Spawning/SpawnerTypings';
import { SpawnerManager, ISpawnerManager } from '../Spawning/SpawnerManager';
import { FactionService } from '../../ReplicatedStorage/ToughS/ComponentModel/Factions/FactionService';
import { IStretcherTool, StretcherTool } from '../../ReplicatedStorage/Equipment/StretcherTool';
import { FactionIdentifier } from '../../ReplicatedStorage/ToughS/ComponentModel/Factions/FactionDescriptions';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { ICtfDisplayManager } from './CaptureTheFlag/CtfModuleTypings';
import { CtfObjectiveManager, ICtfObjectiveManager } from '../FunctionalDomains/Transporting/CtfObjectiveManager';


const rq = requireScript<IRquery>("rquery")
const mapManager = 
    ServerScriptService.WaitForChild(
        "GameModules").WaitForChild(
            "CaptureTheFlag").WaitForChild(
                "CtfMapManager") as ModuleScript

const displayManagerModule = 
    ServerScriptService.WaitForChild(
        "GameModules").WaitForChild(
            "CaptureTheFlag").WaitForChild(
                "CtfDisplayManager") as ModuleScript


const personageSpawnerModule = 
        ServerScriptService.WaitForChild(
            "Spawning").WaitForChild("PersonageSpawner") as ModuleScript;

export class DefaultGameManager extends GameManagerBase implements IGameManager {
    protected _isInitialized : boolean

    PersonageSpawner : IPersonageSpawner
    MapManager : IMapManager
    DisplayManager : ICtfDisplayManager
    CtfObjectiveManager : ICtfObjectiveManager
    SpawnerManager: ISpawnerManager

    constructor() {
        super()
        this.PersonageSpawner = require(personageSpawnerModule) as IPersonageSpawner
        this.MapManager = require(mapManager) as IMapManager
        this.DisplayManager = require(displayManagerModule) as ICtfDisplayManager
        this.CtfObjectiveManager = new CtfObjectiveManager()
        this.SpawnerManager = new SpawnerManager()
        this._isInitialized = false
    }
    protected _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Initialize()
            this._isInitialized = true
        }
    }
    Initialize(): void {
        this.MapManager.SaveMap()
        Spieler.Init()
        FactionService.Init()
        if (GameConfigService.GetFeatureEnabled("UseNpcSpawners")) {
            print("Using NPC Spawners")
            this.SpawnerManager.Init();
        }
        
        this._isInitialized = true
    }    
    RunIntermission(): void {
        
    }
    StopIntermission(): void {
        this.DisplayManager.StopIntermission()
    }
    BeforeGameStart(): void {
        let playerAdded = (player : Player) => {
            player.LoadCharacter()
        }
        Spieler.AddOnPlayerJoinedHandler(playerAdded)
        
        let defaultFaction = FactionIdentifier.Undeclared
        
        let charAdded = (characterModel : Model) => {
            let foundPlayer = Players.GetPlayerFromCharacter(characterModel)
            if (foundPlayer !== undefined) {

                if (Spieler.AddPlayerAsPersonage(foundPlayer)) {
                    print("Added player as personage")
                }
                let entityId = rq.GetOrAddEntityId(characterModel)
                
                let characterPersonage = Spieler.GetPersonageFromEntityId(entityId)
                if (characterPersonage !== undefined) {
                    FactionService.AddPersonageToFaction(
                        characterPersonage, defaultFaction)
                }
            }
        }
        Spieler.AddOnCharacterAddedHandler(charAdded)
    }
    GameReady(): boolean {
        this._ensureInitialized()
        return true
    }
    BeforeRoundStart(): void {
        this._ensureInitialized()
        let stretcher = game.Workspace.FindFirstChild("RealStretcherTool") as Model
        let theLast = new StretcherTool(stretcher) as IStretcherTool
    }
    StartRound(): boolean {
        this._ensureInitialized()
        this.PersonageSpawner.CreateFemaleRunner()
        this.PersonageSpawner.CreateMaleRunner()            
        return true
    }
    Update(): void {
        
    }
    RoundOver(): boolean {

        return false
    }
    RoundCleanup(): void {
        this.MapManager.ClearMap()
    }
    GetCurrentGameState(): IGameState {
        this._ensureInitialized()
        return new GameState(true, false, true)
    }    
}