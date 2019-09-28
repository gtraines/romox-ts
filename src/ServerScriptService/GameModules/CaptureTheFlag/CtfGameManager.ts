import { IGameManager } from '../GameModulesTypings';

export class CtfGameManager implements IGameManager {
    Initialize(): void {
        throw "Method not implemented.";
    }    
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