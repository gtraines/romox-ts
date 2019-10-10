import { IGameManager } from '../GameModules/GameModulesTypings';
import { IConfigManager, ConfigManager } from '../Config/ConfigManager';
import { Spieler } from '../FunctionalDomains/Spieler';
import { FactionService } from '../Components/Factions/FactionService';
import { Personage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { FactionIdentifier } from 'ServerScriptService/Components/Factions/FactionDescriptions';


export class GameJectorFake implements IGameManager {
    ConfigManager: IConfigManager
    protected _isInitialized : boolean

    constructor() {
        this.ConfigManager = new ConfigManager(true)

        this._isInitialized = false

    }

    Initialize(configManager?: IConfigManager | undefined): void {
        Spieler.Init()
        FactionService.Init()
        
        let onCharacterAdded = (character : Model) => {
            let playerPersonage = new Personage(character)
            FactionService.AddPersonageToFaction(playerPersonage, 
                FactionIdentifier.EmergencyMedical)
        }
        Spieler.AddOnCharacterAddedHandler(onCharacterAdded)
        
        this._isInitialized = true
    }
    RunIntermission(): void {
        
    }
    StopIntermission(): void {
        
    }
    GameReady(): boolean {
        
        return this._isInitialized
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