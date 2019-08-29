--[[
    Usage example: 
    	local libFinder = require(game
	:GetService("ServerScriptService")
	:WaitForChild("Finders")
	:WaitForChild("LibFinder"))
    local rq = libFinder:FindLib("RQuery")
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
return require(
    ReplicatedStorage:WaitForChild("LibFinder", 2))
