-- This might have been installed in Lua 5.1 .luarocks so make sure to set the version correctly

local _testMain = require("TestMain")
local game = _testMain.game
local habitat = _testMain.habitat
local ServerScriptService = _testMain.ServerScriptService

-- load ServiceFinder within habitat?
local libFinder = habitat:require(ServerScriptService.Finders.LibFinder)
local svcFinder = habitat:require(ServerScriptService.Finders.ServiceFinder)

