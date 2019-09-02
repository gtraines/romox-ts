local ServerStorage = game:GetService("ServerStorage")

local module = {
    Loaded = false,
    ConfigValues = {}
}

function module:_getConfigs(filename)
    local loadConfigFunc = function(configFilename)
        local foundConfigModule = ServerStorage:FindFirstChild(configFilename)
        if foundConfigModule ~= nil then
            return require(foundConfigModule)
        end
    end
    local success, loadConfigResult = pcall(loadConfigFunc, filename)

    if success then
        return loadConfigResult
    end
    return {}
end

function module:Init(configFilename, configTable)
    if configTable == nil then
        configFilename = configFilename or "Configurations"
        configTable = self:_getConfigs(configFilename)
    end
    for key, value in pairs(configTable) do
        self.ConfigValues[key] = value
    end
    self.Loaded = true
    return self.Loaded
end

function module:GetConfigValueOrDefault(configKey, defaultToReturn)
    if not self.Loaded then
        self:Init()
    end
    if self.ConfigValues[configKey] ~= nil then
        return self.ConfigValues[configKey]
    elseif defaultToReturn ~= nil then
        return defaultToReturn
    end
    return nil
end

function module:GetFeatureEnabled(featureKey)
    if not self.Loaded then
        self:Init()
    end
    if self:GetConfigValueOrDefault("FeatureFlags") ~= nil then
        local featureFlags = self:GetConfigValueOrDefault("FeatureFlags")

        if featureFlags[featureKey] ~= nil then
            return featureFlags[featureKey]
        end
    end
    return false
end

return module