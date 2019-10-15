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
    Init(configFilename?: string, configTable?: Table) : boolean
    GetConfigValueOrDefault<T>(configKey: string, defaultToReturn?: T) : T
    GetFeatureEnabled(featureKey: string) : boolean
    SetFeatureFlags(featureValues : Map<string, boolean>) : void
    SetFeatureFlag(featureKey : string, flagValue : boolean) : void
    SetConfigValue<T>(configKey  : string, value:  T) : void
    LoadConfigFromTable(configTable : Table) : void
    LoadFeatureFlagsFromTable(configTable : Table) : void
    LoadStandardFeatureFlags() : void

    Loaded: boolean
    ConfigTable: Table
    ConfigValues: Map<string, unknown>
    FeatureFlags: Map<string, boolean>
}

export class ConfigManager implements IConfigManager {
    
    constructor(useDefaultConfig : boolean=true) {
        this.ConfigTable = { }
        this.ConfigValues = new Map<string, unknown>()
        this.FeatureFlags = new Map<string, boolean>()
        
        print("Yeehaw")
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
                print("WE GOT BULLETS, YA KNOW")
                let loadedModule = require(foundConfigModule)
                print("Required loaded config module")
                return loadedModule
            }
        }

        let errorMessage = "_getConfigs: " + filename + "; "
        let callResult = pcall(loadFn, filename)
        
        if (callResult[0]) {
            print("BUT IT LOOKS SO COOL")
            let resultItem = callResult[1]
            if (resultItem !== undefined) {
                print("WELL YA GOTTA GO GET IT")
                let castResultItem = resultItem as Table
                if (castResultItem !== undefined) {
                    print("Success! Cast the result of the pcall to a Table")
                    return castResultItem
                }
                throw errorMessage + " Unable to cast to Table"
            }
            throw errorMessage + "PCall failed"
        }
        throw errorMessage
    }

    Init(configFilename?: string | undefined, 
        configTable?: Table | undefined): boolean {
        
        if (configTable === undefined) {
            configFilename = configFilename || "Configurations"
            print("Getting configs: ", configFilename)
            configTable = this._getConfigs(configFilename)
        }
        
        this.LoadConfigFromTable(configTable)
        print("Loaded config from table; next is FEATURE FLAGS")
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
    LoadConfigFromTable(configTable: Table): void {
        this.ConfigTable = configTable
        this.ConfigValues = TableToMap(this.ConfigTable)
        print("VERY NICE I LIKE YOU Loaded config values from table")
        this.ConfigValues.forEach((dictValue, dictKey) => {
            print(tostring(dictValue),": ", tostring(dictKey))
        });
    }

    LoadFeatureFlagsFromTable(configTable: Table): void {
        print("Loading feature flags")
        let featureFlagVals = TableToMap(configTable)
        let ffBools = new Map<string, boolean>()

        featureFlagVals.entries().forEach(ffTableEntry => {
            print(ffTableEntry[0], " : ", tostring(ffTableEntry[1]))
            if (type(ffTableEntry[1]) === "boolean") {
                ffBools.set(ffTableEntry[0], ffTableEntry[1] as boolean)
            }
        });

        this.SetFeatureFlags(ffBools)
    }

    LoadStandardFeatureFlags() : void {
        if (this.ConfigValues.has(GameConfigKeys.FeatureFlags)) {
            print("Config has feature flags")
            let fflagTable = 
                this.ConfigValues.get(GameConfigKeys.FeatureFlags) as Table
             this.LoadFeatureFlagsFromTable(fflagTable)
        }
        else {
            print("Doesn't have feature flags, jerk!!!!!")
            this.ConfigValues.forEach((dictValue, dictKey) => {
                print(tostring(dictValue),": ", tostring(dictKey))
            });
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
    ConfigValues: Map<string, unknown>
    FeatureFlags: Map<string, boolean>
}
