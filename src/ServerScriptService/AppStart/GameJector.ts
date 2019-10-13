import { IGameManager } from '../GameModules/GameModulesTypings';
import { IConfigManager, ConfigManager } from '../Config/ConfigManager';
import { DefaultGameManager } from '../GameModules/DefaultGameManager';

export class GameJector {
    static GetDefaultGame() : IGameManager {
        return new DefaultGameManager()
    }
    static GetGameFromConfig(configManager: IConfigManager) : IGameManager {
        return new DefaultGameManager()
    }
}