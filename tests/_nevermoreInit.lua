local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local replicatedRequire = require(ReplicatedStorage:WaitForChild("Nevermore"))

local nevermoreServerRequire = require(ServerScriptService:WaitForChild("Nevermore"))

local requiredModule = replicatedRequire("ComponentBase")

local nevermoreRequire = require(ReplicatedStorage:WaitForChild(Nevermore))

local module = { 
    NevermoreRequire = nevermoreRequire
}

return module