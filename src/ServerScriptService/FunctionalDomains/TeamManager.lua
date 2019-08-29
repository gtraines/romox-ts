local TeamManager = {}

-- ROBLOX services

local Teams = game:GetService("Teams")
local Players = game:GetService("Players")
local ServerScriptService = game:GetService("ServerScriptService")
local libFinder = require(ServerScriptService:WaitForChild("Finders", 1):WaitForChild("LibFinder", 1))
local randumb = libFinder:FindLib("randumb")

-- Game services
local Configurations = require(game.ServerStorage.Configurations)
local DisplayManager = require(script.Parent.DisplayManager)

-- Local variables

local TeamPlayers = {}
local TeamScores = {}

-- Initialization

for _, team in ipairs(Teams:GetTeams()) do
	TeamPlayers[team] = {}
	TeamScores[team] = 0
end

-- Local Functions

local function GetTeamFromColor(teamColor)
	for _, team in ipairs(Teams:GetTeams()) do
		if team.TeamColor == teamColor then
			return team
		end
	end
	return nil
end

-- Public Functions

function TeamManager:ClearTeamScores()
	for _, team in ipairs(Teams:GetTeams()) do
		TeamScores[team] = 0
		DisplayManager:UpdateScore(team, 0)
	end
end

function TeamManager:HasTeamWon()
	for _, team in ipairs(Teams:GetTeams()) do
		if TeamScores[team] >= Configurations.CAPS_TO_WIN then
			return team
		end
	end
	return false
end

function TeamManager:GetWinningTeam()
	local highestScore = 0
	local winningTeam = nil
	for _, team in ipairs(Teams:GetTeams()) do
		if TeamScores[team] > highestScore then
			highestScore = TeamScores[team]
			winningTeam = team
		end
	end
	return winningTeam
end

function TeamManager:AreTeamsTied()
	local teams = Teams:GetTeams()
	local highestScore = 0
	local tied = false
	for _, team in ipairs(teams) do
		if TeamScores[team] == highestScore then
			tied = true
		elseif TeamScores[team] > highestScore then
			tied = false
			highestScore = TeamScores[team]
		end
	end
	return tied
end

function TeamManager:AssignPlayerToTeam(player)
	local smallestTeam
	local lowestCount = math.huge
	for team, playerList in pairs(TeamPlayers) do
		if #playerList < lowestCount then
			smallestTeam = team
			lowestCount = #playerList
		end
	end
	table.insert(TeamPlayers[smallestTeam], player)
	player.Neutral = false
	player.TeamColor = smallestTeam.TeamColor
end

function TeamManager:RemovePlayer(player)
	local team = GetTeamFromColor(player.TeamColor)
	local teamTable = TeamPlayers[team]
	for i = 1, #teamTable do
		if teamTable[i] == player then
			table.remove(teamTable, i)
			return
		end
	end
end

function TeamManager:ShuffleTeams()
	for _, team in ipairs(Teams:GetTeams()) do
		TeamPlayers[team] = {}
	end
	local players = Players:GetPlayers()
	local shuffledPlayers = randumb:ShuffleList(players)
	for _, player in pairs(shuffledPlayers) do 
		TeamManager:AssignPlayerToTeam(player)
	end
end

function TeamManager:AddTeamScore(teamColor, score)
	local team = GetTeamFromColor(teamColor)
	TeamScores[team] = TeamScores[team] + score
	DisplayManager:UpdateScore(team, TeamScores[team])
end

return TeamManager
