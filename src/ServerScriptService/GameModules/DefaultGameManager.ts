import { ServerScriptService } from '@rbxts/services';
import { GameManagerBase } from "./GameManagerBase";
import { GameConfigService } from '../Config/GameConfigService';
import { IGameState, GameState } from './GameState';
import { IGameManager } from "./GameModulesTypings";
import { Spieler } from '../FunctionalDomains/Spieler';
import { Personage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IPersonageSpawner } from '../Spawning/SpawnerTypings';
import { SpawnerManager } from '../Spawning/SpawnerManager';
import { FactionService } from '../../ReplicatedStorage/ToughS/ComponentModel/Factions/FactionService';
import { IStretcherTool, StretcherTool } from '../../ReplicatedStorage/Equipment/StretcherTool';
import { FactionIdentifier } from '../../ReplicatedStorage/ToughS/ComponentModel/Factions/FactionDescriptions';

const personageSpawnerModule = 
        ServerScriptService.WaitForChild("Spawning").WaitForChild("PersonageSpawner") as ModuleScript;

export class DefaultGameManager extends GameManagerBase implements IGameManager {
    protected _isInitialized : boolean

    PersonageSpawner : IPersonageSpawner
    constructor() {
        super()
        this.PersonageSpawner = require(personageSpawnerModule) as IPersonageSpawner
        this._isInitialized = false
    }
    protected _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Initialize()
            this._isInitialized = true
        }
    }
    Initialize(): void {
        Spieler.Init()
        FactionService.Init()
        if (GameConfigService.GetFeatureEnabled("UseNpcSpawners")) {
            const spawnerManager = new SpawnerManager();
            spawnerManager.Init();
        }
        this._isInitialized = true
    }    
    RunIntermission(): void {
    
    }
    StopIntermission(): void {
    
    }
    BeforeGameStart(): void {
        let handler = (player : Player) => {
            let defaultFaction = FactionIdentifier.Undeclared
            Spieler.AddPlayerAsPersonage(player)
            let playerAsPersonage = Spieler.FindPersonageFromPlayer(player)
            FactionService.AddPersonageToFaction(playerAsPersonage, defaultFaction)
        }
        Spieler.PerformOnAllCurrentAndFuturePlayers(handler)

    }
    GameReady(): boolean {
        this._ensureInitialized()
        return true
    }
    BeforeRoundStart(): void {
        let stretcher = game.Workspace.FindFirstChild("RealStretcherTool") as Model
        let theLast = new StretcherTool(stretcher) as IStretcherTool
    }
    StartRound(): boolean {
        
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
        
    }
    GetCurrentGameState(): IGameState {
        return new GameState(true, false, true)
    }    
}