import { IGameManager } from '../GameModules/GameModulesTypings';
import { IConfigManager, ConfigManager } from '../Config/ConfigManager';

export class GameJectorFake implements IGameManager {
    ConfigManager: IConfigManager
    
    constructor() {
        this.ConfigManager = new ConfigManager(true)
    }

    Initialize(configManager?: IConfigManager | undefined): void {
        
    }
    RunIntermission(): void {
        
    }
    StopIntermission(): void {
        
    }
    GameReady(): boolean {
        return true
    }
    StartRound(): boolean {
        return true
    }
    Update(): void {
        
    }
    RoundOver(): boolean {
        return false
    }
    RoundCleanup(): void {
        
    }   
}

export class GameJector {
    static GetGameFromConfig(configManager: IConfigManager) : IGameManager {
        return new GameJectorFake()
    }
}