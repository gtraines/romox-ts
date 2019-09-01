local ReplicatedStorage = game:GetService("ReplicatedStorage")
local require = require(ReplicatedStorage:WaitForChild("Nevermore", 2))
local std = require("Std")

local dedupedModules = {}

dedupedModules["Std"] = std

for name, libModule in pairs(std) do
    dedupedModules[name] = libModule
end

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