export interface IGameManager {
    Initialize() : void;
    RunIntermission() : void;
    StopIntermission() : void;
    GameReady() : boolean;
    StartRound() : boolean;
    Update() : void;
    RoundOver() : boolean;
    RoundCleanup() : void;
}
