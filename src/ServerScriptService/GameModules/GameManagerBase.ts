import { IGameManager } from './GameModulesTypings';
import { ReplicatedStorage } from '@rbxts/services';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { IGameState, GameState } from './GameState';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';

const rq = requireScript<IRquery>("rquery")
const Events = rq.GetOrAddItem("Events", "Folder", ReplicatedStorage)

export abstract class GameManagerBase implements IGameManager {
    
    constructor() {
        
    }
    abstract Initialize(): void
    abstract RunIntermission(): void
    abstract StopIntermission(): void
    abstract BeforeGameStart(): void
    abstract GameReady(): boolean
    abstract BeforeRoundStart(): void
    abstract StartRound(): boolean
    abstract Update(): void
    abstract RoundOver(): boolean
    abstract RoundCleanup(): void
    abstract GetCurrentGameState() : IGameState
}