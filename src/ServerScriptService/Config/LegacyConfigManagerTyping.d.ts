export interface ILegacyConfigManager {
    new(): ILegacyConfigManager
    Init(configFileName?: string, configTable?: Table) : boolean
    GetConfigValueOrDefault<TValue>(configKey: string, defaultToReturn: TValue) : TValue
    GetFeatureEnabled(featureKey: string) : boolean
}