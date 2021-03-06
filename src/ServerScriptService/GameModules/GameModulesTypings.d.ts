import { IConfigManager } from '../Config/ConfigManager';
import { IGameState } from './GameState';


export interface IMapManager {
    Initialize() : void
    SaveMap() : void
    ClearMap() : void
    LoadMap() : void
}


export interface IGameManager {

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
    GetCurrentGameState() : IGameState
}
