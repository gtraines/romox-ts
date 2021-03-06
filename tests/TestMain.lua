
-- newproxy = function(yesOrNo)
--     if yesOrNo ~= true then
--         return {}
--     end
    
--     local proto = {}
--     local meta = { 
--         __index = proto,
--         __len = 0,
--         __type = "userdata"
--      }
    
--     local receiver = setmetatable({}, meta)
--     return receiver
-- end

local lemur = require("lemur")
local habitat = lemur.Habitat.new()

local function ServerScriptServicePath( serverScriptServicePath  )
    return "../out/ServerScriptService/" .. serverScriptServicePath
end

local function ReplicatedStoragePath( replicatedStoragePath  )
    return "../out/ReplicatedStorage/" .. replicatedStoragePath
end
local function ToughSPath( toughSPath )
    return ReplicatedStoragePath("ToughS/" .. toughSPath) 
end

local ServerScriptService = habitat.game:GetService("ServerScriptService")
local ReplicatedStorage = habitat.game:GetService("ReplicatedStorage")

local game = habitat.game

--[[
    ToughS folder contents
]]
local topLevelReplicatedStorage = habitat:loadFromFs(ReplicatedStoragePath(""))
topLevelReplicatedStorage.Parent = ReplicatedStorage

local toughS = habitat:loadFromFs(ToughSPath(""))
toughS.Parent = ReplicatedStorage

-- StandardLib
local toughSStdLib = habitat:loadFromFs(ToughSPath("StandardLib"))
toughSStdLib.Parent = toughS

local toughSStdLibDataAccess = habitat:loadFromFs(ToughSPath("StandardLib/DataAccess"))
toughSStdLibDataAccess.Parent = toughSStdLib

-- ComponentModel

local toughSComponentModel = habitat:loadFromFs(ReplicatedStoragePath("ToughS/ComponentModel"))
toughSComponentModel.Parent = toughS

local toughSFactions = habitat:loadFromFs(ReplicatedStoragePath("ToughS/ComponentModel/Factions"))
toughSFactions.Parent = toughSComponentModel

local nevermoreInit = habitat:loadFromFs("./_nevermoreInit.lua")
nevermoreInit.Parent = ServerScriptService

local nevermoreScripts = habitat:loadFromFs(ReplicatedStoragePath("Nevermore"))
nevermoreScripts.Parent = ReplicatedStorage

local nvrMoreServerSide = habitat:loadFromFs(ServerScriptServicePath("Nevermore"))
nvrMoreServerSide.Parent = ServerScriptService

local nevermoreInit = habitat:loadFromFs("./_nevermoreInit.lua")
nevermoreInit.Parent = ServerScriptService

--local nevermoreResources = habitat:loadFromFs(ReplicatedStoragePath("NevermoreResources"))
--nevermoreResources.Parent = ReplicatedStorage

local equipment = habitat:loadFromFs(ReplicatedStoragePath("Equipment"))
equipment.Parent = ReplicatedStorage

--[[
    ServerScriptService
]]
local sss = habitat:loadFromFs(ServerScriptServicePath(""))
sss.Parent = ServerScriptService

local config = habitat:loadFromFs(ServerScriptServicePath("Config"))
config.Parent = ServerScriptService

-- Components folder
local componentsFolder = habitat:loadFromFs(ServerScriptServicePath("Components"))
componentsFolder.Parent = ServerScriptService

local elsComponents = habitat:loadFromFs(ServerScriptServicePath("Components/Els"))
elsComponents.Parent = componentsFolder

local factions = habitat:loadFromFs(ServerScriptServicePath("Components/Factions"))
factions.Parent = componentsFolder

--[[ FunctionalDomains ]]
local functionalDomains = habitat:loadFromFs(ServerScriptServicePath("FunctionalDomains"))
functionalDomains.Parent = ServerScriptService

local trxDomain = habitat:loadFromFs(ServerScriptServicePath("FunctionalDomains/Transporting"))
trxDomain.Parent = functionalDomains

--[[ Agents ]]
local agents = habitat:loadFromFs(ServerScriptServicePath("Agents"))
agents.Parent = ServerScriptService

local agentsComponents = habitat:loadFromFs(ServerScriptServicePath("Agents/Components"))
agentsComponents.Parent = agents

-- Finders
local finderFolder = habitat:loadFromFs(ServerScriptServicePath("Finders"))
finderFolder.Parent = ServerScriptService

--[[ Spawning ]]
local spawning = habitat:loadFromFs(ServerScriptServicePath("Spawning"))
spawning.Parent = ServerScriptService

local npcSpawners = habitat:loadFromFs(ServerScriptServicePath("Spawning/NpcSpawners"))
npcSpawners.Parent = spawning

--[[ GameModules ]]
local gameModules = habitat:loadFromFs(ServerScriptServicePath("GameModules"))
gameModules.Parent = ServerScriptService

local ctfModule = habitat:loadFromFs(ServerScriptServicePath("GameModules/CaptureTheFlag"))
ctfModule.Parent = gameModules

-- AppStart
local appStart = habitat:loadFromFs(ServerScriptServicePath("AppStart"))
appStart.Parent = ServerScriptService

local childses = habitat.game:GetService("ServerScriptService"):GetChildren()

for _, name in pairs(childses) do
    print(name)
end


local module = {
    game = game,
    habitat = habitat,
    ServerScriptService = ServerScriptService,
    ReplicatedStorage = ReplicatedStorage
}

return module