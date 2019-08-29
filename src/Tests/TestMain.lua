
local lemur = require("lemur")
local habitat = lemur.Habitat.new()

local ServerScriptService = habitat.game:GetService("ServerScriptService")
local ReplicatedStorage = habitat.game:GetService("ReplicatedStorage")

local game = habitat.game

local replicatedScripts = habitat:loadFromFs("../ReplicatedStorage/Scripts")
replicatedScripts.Parent = ReplicatedStorage
local equipmentScripts = habitat:loadFromFs("../ReplicatedStorage/Scripts/Equipment")
equipmentScripts.Parent = replicatedScripts

local sharedLibs = habitat:loadFromFs("../ReplicatedStorage/Scripts/SharedLibs")
sharedLibs.Parent = replicatedScripts

local finderFolder = habitat:loadFromFs("../ServerScriptService/Finders")
finderFolder.Parent = ServerScriptService

local componentsFolder = habitat:loadFromFs("../ServerScriptService/Components")
componentsFolder.Parent = ServerScriptService

local elsComponents = habitat:loadFromFs("../ServerScriptService/Components/Els")
elsComponents.Parent = componentsFolder

local frameworkFolder = habitat:loadFromFs("../ServerScriptService/Framework")
frameworkFolder.Parent = ServerScriptService

local gameModules = habitat:loadFromFs("../ServerScriptService/GameModules")
gameModules.Parent = ServerScriptService

local appStart = habitat:loadFromFs("../ServerScriptService/AppStart")
appStart.Parent = ServerScriptService

local module = {
    game = game,
    habitat = habitat,
    ServerScriptService = ServerScriptService
}

return module