import { IConfigManager, ConfigManager } from './ConfigManager';


export class GameConfigService {
    private static _cfgManager : IConfigManager
    private static _isInitialized : boolean
    private static _usingCustomConfigTable : boolean
    private static _customConfigTableName : string
    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            if (!this._usingCustomConfigTable || 
                this._customConfigTableName === undefined){
                this._cfgManager = new ConfigManager(true)
            } else {
                this._cfgManager = new ConfigManager(false)
                this._cfgManager.Init(this._customConfigTableName)
            }
            
            this._isInitialized = true
        }
    }

    static SetCustomConfigTableName(tableName : string) : void {
        this._isInitialized = false
        this._usingCustomConfigTable = true
        this._customConfigTableName = tableName
        this._cfgManager = new ConfigManager(false)
        this._cfgManager.Init(tableName)
        this._isInitialized = true
    }
    static GetGlobalSettingValueAsString(settingKey: string) : string {
        this._ensureInitialized()
        return this._cfgManager.GetConfigValueOrDefault(settingKey, "")
    }
    static GetGlobalSettingValueAsBool(settingKey: string) : boolean {
        this._ensureInitialized()
        return this._cfgManager.GetConfigValueOrDefault(settingKey, false)
    }
    static GetGlobalSettingValueAsNumber(settingKey: string) : number {
        this._ensureInitialized()
        return this._cfgManager.GetConfigValueOrDefault(settingKey, 0)
    }
    static GetFeatureEnabled(featureKey: string) : boolean {
        this._ensureInitialized()
        return this._cfgManager.GetFeatureEnabled(featureKey)
    }
}