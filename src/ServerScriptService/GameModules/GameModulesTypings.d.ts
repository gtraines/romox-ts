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
    BeforeGameStart() : void
    GameReady() : boolean
    RunIntermission() : void
    StopIntermission() : void
    BeforeRoundStart() : void
    StartRound() : boolean
    Update() : void;
    RoundOver() : boolean;
    RoundCleanup() : void;
}
