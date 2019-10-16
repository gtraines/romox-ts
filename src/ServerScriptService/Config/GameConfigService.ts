import { ServerScriptService } from '@rbxts/services';
import { ILegacyConfigManager } from './LegacyConfigManagerTyping';

const cfgFolder = ServerScriptService.FindFirstChild(
    "Config") as Folder
const cfgMgrModuleScript = cfgFolder.FindFirstChild("LegacyConfigManager") as ModuleScript
const LegacyConfigManager = require(cfgMgrModuleScript) as ILegacyConfigManager

export class GameConfigService {
    private static _cfgManager : ILegacyConfigManager
    private static _isInitialized : boolean
    private static _usingCustomConfigTable : boolean
    private static _customConfigTableName : string
    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this._cfgManager = new LegacyConfigManager()

            // if (!this._usingCustomConfigTable || 
            //     this._customConfigTableName === undefined){
            //     this._cfgManager = new LegacyConfigManager()
            // } else {
            //     this._cfgManager = new ConfigManager(false)
            //     this._cfgManager.Init(this._customConfigTableName)
            // }
            
            this._isInitialized = true
        }
    }

    // static SetCustomConfigTableName(tableName : string) : void {
    //     this._isInitialized = false
    //     this._usingCustomConfigTable = true
    //     this._customConfigTableName = tableName
    //     this._cfgManager = new ConfigManager(false)
    //     this._cfgManager.Init(tableName)
    //     this._isInitialized = true
    // }
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