export interface IConfigManager {
    Init(configFilename?: string, configTable?: Table) : boolean
    GetConfigValueOrDefault(configKey: string, defaultToReturn?: any) : any
    GetFeatureEnabled(featureKey: string) : boolean
    Loaded: boolean
    ConfigValues: Table
}

export interface IGameManager {
    ConfigManager : IConfigManager
    IsConfigLoaded : boolean
    LoadedConfig : Table
    LoadedConfigValues : Map<string, string>
    LoadedFeatureFlags : Map<string, string>

    LoadConfigFromTable(table : Table) : void
    LoadStandardConfig() : void

    LoadFeatureFlagsFromTable(table : Table) : void
    LoadStandardFeatureFlags() : void

    Initialize(configManager? : IConfigManager) : void;
    RunIntermission() : void;
    StopIntermission() : void;
    GameReady() : boolean;
    StartRound() : boolean;
    Update() : void;
    RoundOver() : boolean;
    RoundCleanup() : void;
}
