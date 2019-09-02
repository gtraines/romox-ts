export interface IConfigManager {
    Init(configFilename?: string, configTable?: Table) : boolean
    GetConfigValueOrDefault(configKey: string, defaultToReturn?: any) : any
    GetFeatureEnabled(featureKey: string) : boolean
    Loaded: boolean
    ConfigValues: Table
}
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
