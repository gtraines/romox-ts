export interface ILegacyConfigManager {
    new(): ILegacyConfigManager
    Init(configFileName?: string, configTable?: object) : boolean
    GetConfigValueOrDefault<TValue>(configKey: string, defaultToReturn: TValue) : TValue
    GetFeatureEnabled(featureKey: string) : boolean
}