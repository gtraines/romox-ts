export interface IGameState {
    IntermissionRunning : boolean
    EnoughPlayers : boolean
    GameRunning : boolean
}

export class GameState implements IGameState {
    IntermissionRunning: boolean;
    EnoughPlayers: boolean;
    GameRunning: boolean;
    constructor(gameRunning : boolean, 
        intermissionRunning : boolean, 
        enoughPlayers : boolean) {
            this.GameRunning = gameRunning
            this.IntermissionRunning = intermissionRunning
            this.EnoughPlayers = enoughPlayers
    }
}