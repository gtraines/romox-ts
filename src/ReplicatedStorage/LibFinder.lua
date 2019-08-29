local ReplicatedStorage = game:GetService("ReplicatedStorage")
local foldersWithLibRegistrations = {
    Shared = ReplicatedStorage:WaitForChild("Shared", 2),
    Std = ReplicatedStorage:WaitForChild("Std", 2),
}

local dedupedModules = {}
for _, folder in pairs(foldersWithLibRegistrations) do
    local registrationModuleScript = folder:FindFirstChild("_registerLibs")
    if registrationModuleScript ~= nil then
        local registrationModule = require(registrationModuleScript)
    
        for key,mod in pairs(registrationModule) do
            if dedupedModules[key] == nil then
                dedupedModules[key] = mod
            end
        end
    end
end

dedupedModules["Std"] = require(foldersWithLibRegistrations.Std.Namespace)

local module = {
    RegisteredLibs = dedupedModules
}

function module:FindLib(libName)
    if self.RegisteredLibs ~= nil then
        -- First try
        local foundLib = self.RegisteredLibs[libName]
        if foundLib ~= nil then
            return foundLib
        end

        -- Take another shot
        foundLib = self.RegisteredLibs[string.lower(libName)]
        if foundLib ~= nil then
            return foundLib
        end

        -- Last try
        for libKey, libValue in pairs(self.RegisteredLibs) do
            if string.lower(libKey) == string.lower(libName) then
                return libValue
            end
        end
        error("Library " .. libName .. " not found")
        return nil
    end
end

return module