import { TableToMap } from '../../ReplicatedStorage/ToughS/StandardLib/TableMap';
import { ServerStorage } from '@rbxts/services';


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
    Init(configFilename?: string, configTable?: Table) : boolean
    GetConfigValueOrDefault<T>(configKey: string, defaultToReturn?: T) : T
    GetFeatureEnabled(featureKey: string) : boolean
    SetFeatureFlags(featureValues : Map<string, boolean>) : void
    SetFeatureFlag(featureKey : string, flagValue : boolean) : void
    SetConfigValue<T>(configKey  : string, value:  T) : void
    LoadConfigFromTable(table : Table) : void
    LoadFeatureFlagsFromTable(table : Table) : void
    LoadStandardFeatureFlags() : void

    Loaded: boolean
    ConfigTable: Table
    ConfigValues: Map<string, any>
    FeatureFlags: Map<string, boolean>
}

export class ConfigManager implements IConfigManager {
    
    constructor(useDefaultConfig : boolean=true) {
        this.ConfigTable = { }
        this.ConfigValues = new Map<string, any>()
        this.FeatureFlags = new Map<string, boolean>()
        
        if (useDefaultConfig) {
            this.Init()
        }
    }
    private _ensureInitialized() : void {
        if (!this.Loaded) {
            this.Init()
        }
    }
    _getConfigs(filename : string) : Table {

        let loadFn = (confFilename : string) => {
            let foundConfigModule = ServerStorage.FindFirstChild(confFilename) as ModuleScript
            if (foundConfigModule !== undefined) {
                return require(foundConfigModule)
            }
        }

        let errorMessage = "_getConfigs: " + filename + "; "
        let callResult = pcall(loadFn, filename)
        
        if (callResult[0]) {
            let resultItem = callResult[1]
            if (resultItem !== undefined) {
                let castResultItem = resultItem as Table
                if (castResultItem !== undefined) {
                    return castResultItem
                }
                throw errorMessage + "Unable to cast to Table"
            }
            throw errorMessage + "PCall failed"
        }
        throw errorMessage
    }

    Init(configFilename?: string | undefined, 
        configTable?: Table | undefined): boolean {
        
        if (configTable === undefined) {
            configFilename = configFilename || "Configurations"
            configTable = this._getConfigs(configFilename)
        }
        
        this.LoadConfigFromTable(configTable)
        this.LoadStandardFeatureFlags()
        this.Loaded = true
        return this.Loaded
    }

    GetConfigValueOrDefault<T>(configKey: string, defaultToReturn?: T) : T {
        
        if (this.ConfigValues.has(configKey)) {
            return this.ConfigValues.get(configKey) as T
        }

        return defaultToReturn as T
    }

    GetFeatureEnabled(featureKey: string): boolean {
        this._ensureInitialized()
        if (this.FeatureFlags.has(featureKey)) {
            return this.FeatureFlags.get(featureKey) as boolean
        }
        
        return false
    }
    LoadConfigFromTable(table: Table): void {
        this.ConfigTable = table
        this.ConfigValues = TableToMap(this.ConfigTable)
    }

    LoadFeatureFlagsFromTable(table: Table): void {

        let featureFlagVals = TableToMap(table)
        this.SetFeatureFlags(featureFlagVals)
    }

    LoadStandardFeatureFlags() : void {
        if (this.ConfigValues.has(GameConfigKeys.FeatureFlags)) {
            let fflagTable = 
                this.ConfigValues.get(GameConfigKeys.FeatureFlags) as Table
             this.LoadFeatureFlagsFromTable(fflagTable)
        }
    }

    SetFeatureFlags(featureValues: Map<string, boolean>): void {
        this._ensureInitialized()
        featureValues.forEach((value : boolean, key : string) => {
            this.FeatureFlags.set(key, value)
        })
    }

    SetFeatureFlag(featureKey: string, flagValue: boolean = true): void {
        this._ensureInitialized()
        this.FeatureFlags.set(featureKey, flagValue)
    }

    SetConfigValue<T>(configKey: string, value: T): void {
        this._ensureInitialized()
        this.ConfigValues.set(configKey, value)
    }

    Loaded: boolean = false
    ConfigTable: Table
    ConfigValues: Map<string, any>
    FeatureFlags: Map<string, boolean>
}
