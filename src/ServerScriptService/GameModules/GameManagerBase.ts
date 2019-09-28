import { IGameManager, IConfigManager } from './GameModulesTypings';


export abstract class GameManagerBase implements IGameManager {
    IsConfigLoaded = false
    AreFeatureFlagsLoaded = false
    IsConfigManagerLoaded = false
    abstract ConfigManager: IConfigManager;
    abstract LoadedConfig: Table;
    abstract LoadedConfigValues: Map<string, string>;
    abstract LoadedFeatureFlags: Map<string, string>;

    LoadConfigFromTable(table: Table): void {
        
        this.IsConfigLoaded = true
        throw "Method not implemented.";
    }
    LoadStandardConfig(): void {
        this.IsConfigLoaded = true
        throw "Method not implemented.";
    }
    LoadFeatureFlagsFromTable(table: Table): void {
        
        this.AreFeatureFlagsLoaded = true
        throw "Method not implemented.";

    }
    LoadStandardFeatureFlags(): void {
        
        this.AreFeatureFlagsLoaded = true
        throw "Method not implemented.";
    }

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