import { IConfigManager } from './ConfigManager';

export interface IMapManager {
    Initialize() : void
    SaveMap() : void
    ClearMap() : void
    LoadMap() : void
}

export interface IGameManager {
    ConfigManager : IConfigManager

    Initialize(configManager? : IConfigManager) : void;
    RunIntermission() : void;
    StopIntermission() : void;
    GameReady() : boolean;
    StartRound() : boolean;
    Update() : void;
    RoundOver() : boolean;
    RoundCleanup() : void;
}
