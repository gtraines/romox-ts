import { ServerScriptService } from '@rbxts/services';
import { ILegacyConfigManager } from './LegacyConfigManagerTyping';

const cfgFolder = ServerScriptService.FindFirstChild(
    "Config") as Folder
const cfgMgrModuleScript = cfgFolder.FindFirstChild("LegacyConfigManager") as ModuleScript
const LegacyConfigManager = require(cfgMgrModuleScript) as ILegacyConfigManager

export class GameConfigService {
    private static _cfgManager : ILegacyConfigManager
    private static _isInitialized : boolean
    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this._cfgManager = new LegacyConfigManager()
            this._isInitialized = true
        }
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