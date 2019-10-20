
local _testMain = require("TestMain")
local game = _testMain.game
local habitat = _testMain.habitat
local ServerScriptService = _testMain.ServerScriptService

-- load ServiceFinder within habitat?
local libFinder = habitat:require(ServerScriptService.Finders.LibFinder)

local uuidMod = libFinder:FindLib("uuid")

uuidMod.seed()

local uuidInst = uuidMod()

print(uuidInst)