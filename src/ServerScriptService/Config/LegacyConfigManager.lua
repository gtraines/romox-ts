local ServerStorage = game:GetService("ServerStorage")

local moduleProto = {
    __type = "ConfigManager",
    Loaded = false,
    ConfigValues = {}
}

local configManagerMeta = { __index = moduleProto }

function moduleProto:_getConfigs(filename)
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

function moduleProto:Init(configFilename, configTable)
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

function moduleProto:GetConfigValueOrDefault(configKey, defaultToReturn)
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

function moduleProto:GetFeatureEnabled(featureKey)
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

function moduleProto.new()
	local self = setmetatable({}, configManagerMeta)
	return self
end

return moduleProto