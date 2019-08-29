--[[
    Usage example: 
    	local DomainFinder = require(game
	:GetService("ServerScriptService")
	:WaitForChild("Finders")
	:WaitForChild("DomainFinder"))
    local pointsSvc = svcFinder:FindService("points")
]]

local ServerScriptService = game:GetService("ServerScriptService")

local allChildFolders = ServerScriptService:GetChildren()
print("Generating DomainFinder module")
local dedupedModules = {}


for _, folder in pairs(allChildFolders) do
    local registrationModuleScript = folder:FindFirstChild("_registerModules", false)
    if registrationModuleScript ~= nil then
        print(registrationModuleScript)
        local registrationModule = require(registrationModuleScript)
        for key,mod in pairs(registrationModule) do
            if dedupedModules[key] == nil then
                dedupedModules[key] = mod
            end
        end
    end
end

local module = {}
module["RegisteredServices"] = dedupedModules

function module:FindDomain(serviceName)
    if self.RegisteredServices ~= nil then
        -- First try
        local foundService = self.RegisteredServices[serviceName]
        if foundService ~= nil then
            return foundService
        end

        -- Take another shot
        foundService = self.RegisteredServices[string.lower(serviceName)]
        if foundService ~= nil then
            return foundService
        end

        -- Last try
        for svcKey, svcValue in pairs(self.RegisteredServices) do
            if string.lower(svcKey) == string.lower(serviceName) then
                return svcValue
            end
        end

        error("Domain " .. serviceName .. " not found")
        return nil
    end
end
return module