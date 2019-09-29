import { IGameManager } from './GameModulesTypings';
import { IConfigManager, ConfigManager, GameConfigKeys, FeatureFlagKeys } from './ConfigManager';
import { ReplicatedStorage } from '@rbxts/services';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';

const rq = requireScript<IRquery>("rquery")
const Events = rq.GetOrAddItem("Events", "Folder", ReplicatedStorage)

export interface IGameState {
    IntermissionRunning : boolean
    EnoughPlayers : boolean
    GameRunning : boolean
}


export abstract class GameManagerBase implements IGameManager {

    ConfigManager: IConfigManager;
    
    constructor(configManager? : IConfigManager) {

        if (configManager === undefined) {
            this.ConfigManager = new ConfigManager()
        } else {
            this.ConfigManager = configManager
        }
    }

    abstract Initialize(): void 
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
}