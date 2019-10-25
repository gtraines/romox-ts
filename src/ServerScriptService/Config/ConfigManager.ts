import { TableToMap } from '../../ReplicatedStorage/ToughS/StandardLib/TableMap';
import { ServerStorage } from '@rbxts/services';

// Transform and roll out
export const enum GameConfigKeys {
    INTERMISSION_DURATION = "INTERMISSION_DURATION",
    MIN_PLAYERS = "MIN_PLAYERS",
    ROUND_DURATION = "ROUND_DURATION",
    END_GAME_WAIT = "END_GAME_WAIT",
    FeatureFlags = "FeatureFlags"
}

export const enum FeatureFlagKeys {
    UseVehicleSpawners = "UseVehicleSpawners",
    UseNpcSpawners = "UseNpcSpawners",
    IsCaptureTheFlag = "IsCaptureTheFlag",
    UseSaveMap = "UseSaveMap",
    UseGameRounds = "UseGameRounds",
    AssignTeams = "AssignTeams"
}

export interface IConfigManager {
    Init(configFilename?: string, configTable?: object) : boolean
    GetConfigValueOrDefault<T>(configKey: string, defaultToReturn?: T) : T
    GetFeatureEnabled(featureKey: string) : boolean
    SetFeatureFlags(featureValues : Map<string, boolean>) : void
    SetFeatureFlag(featureKey : string, flagValue : boolean) : void
    SetConfigValue<T>(configKey  : string, value:  T) : void
    LoadConfigFromTable(configTable : object) : void
    LoadFeatureFlagsFromTable(configTable : object) : void
    LoadStandardFeatureFlags() : void

    Loaded: boolean
    ConfigTable: object
    ConfigValues: Map<string, unknown>
    FeatureFlags: Map<string, boolean>
}
