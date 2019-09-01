local ServerScriptService = game:GetService("ServerScriptService")
local Workspace = game:GetService("Workspace")

local findersFolder = ServerScriptService:WaitForChild("Finders", 2)
local DomainFinder = require(findersFolder:WaitForChild("DomainFinder", 2))
local exNihilo = DomainFinder:FindDomain("exnihilo")

local agentsFolder = ServerScriptService:WaitForChild("Agents", 2)
local pathfindingAi = require(agentsFolder:WaitForChild("PathfindingAiBase"))
local npcNames = require(agentsFolder:WaitForChild("NpcNames"))

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local require = require(ReplicatedStorage:WaitForChild("Nevermore"))

local _ = require("rodash")
local std = require("Std")
local rq = std.rquery
local randumb = std.randumb

local agent = {
    ManagedEntities = {}
}

return agent