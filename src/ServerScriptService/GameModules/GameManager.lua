local GameManager = {}

-- ROBLOX services
local Players = game:GetService("Players")
local ServerStorage = game:GetService("ServerStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local findersFolder = ServerScriptService:WaitForChild("Finders")
local DomainFinder = require(findersFolder:WaitForChild("DomainFinder", 2))

-- Game services
local Configurations = require(ServerStorage:WaitForChild("Configurations", 1))
local TeamManager = DomainFinder:FindDomain("TeamManager")
local PlayerManager = DomainFinder:FindDomain("PlayerManager")
local MapManager = DomainFinder:FindDomain("MapManager")
local TimeManager = DomainFinder:FindDomain("TimeManager")
local DisplayManager = DomainFinder:FindDomain("DisplayManager")


local GameManager = {
	Waypoints = {},
	CurrentWaypointIndex = 2,
	Personage = nil
	}

-- Local Variables
local IntermissionRunning = false
local EnoughPlayers = false
local GameRunning = false
local Events = game.ReplicatedStorage.Events
local CaptureFlag = Events.CaptureFlag
local ReturnFlag = Events.ReturnFlag

-- Local Functions
function OnCaptureFlag(player)
	PlayerManager:AddPlayerScore(player, 1)
	TeamManager:AddTeamScore(player.TeamColor, 1)
	DisplayManager:DisplayNotification(player.TeamColor, 'Captured Flag!')
end

local function OnReturnFlag(flagColor)
	DisplayManager:DisplayNotification(flagColor, 'Flag Returned!')
end

-- Public Functions
function GameManager:Initialize()
	MapManager:SaveMap()
end

function GameManager:RunIntermission()
	IntermissionRunning = true
	TimeManager:StartTimer(Configurations.INTERMISSION_DURATION)
	DisplayManager:StartIntermission()
	EnoughPlayers = Players.NumPlayers >= Configurations.MIN_PLAYERS	
	DisplayManager:UpdateTimerInfo(true, not EnoughPlayers)
	spawn(function()
		repeat
			if EnoughPlayers and Players.NumPlayers < Configurations.MIN_PLAYERS then
				EnoughPlayers = false
			elseif not EnoughPlayers and Players.NumPlayers >= Configurations.MIN_PLAYERS then
				EnoughPlayers = true
			end
			DisplayManager:UpdateTimerInfo(true, not EnoughPlayers)
			wait(.5)
		until IntermissionRunning == false
	end)
	
	wait(Configurations.INTERMISSION_DURATION)
	IntermissionRunning = false
end

function GameManager:StopIntermission()
	--IntermissionRunning = false
	DisplayManager:UpdateTimerInfo(false, false)
	DisplayManager:StopIntermission()
end

function GameManager:GameReady()
	return Players.NumPlayers >= Configurations.MIN_PLAYERS
end


	
function GameManager:StartRound()
	TeamManager:ClearTeamScores()
	PlayerManager:ClearPlayerScores()
	
	PlayerManager:AllowPlayerSpawn(true)
	PlayerManager:LoadPlayers()
	
	GameRunning = true
	PlayerManager:SetGameRunning(true)
	TimeManager:StartTimer(Configurations.ROUND_DURATION)

end


function GameManager:Update()
	--TODO: Add custom custom game code here

end

function GameManager:RoundOver()
	local winningTeam = TeamManager:HasTeamWon()
	if winningTeam then
		DisplayManager:DisplayVictory(winningTeam)
		return true
	end
	if TimeManager:TimerDone() then
		if TeamManager:AreTeamsTied() then
			DisplayManager:DisplayVictory('Tie')
		else
			winningTeam = TeamManager:GetWinningTeam()
			DisplayManager:DisplayVictory(winningTeam)
		end
		return true
	end
	return false
end

function GameManager:RoundCleanup()
	PlayerManager:SetGameRunning(false)
	wait(Configurations.END_GAME_WAIT)
	PlayerManager:AllowPlayerSpawn(false)
	PlayerManager:DestroyPlayers()
	DisplayManager:DisplayVictory(nil)
	TeamManager:ClearTeamScores()
	PlayerManager:ClearPlayerScores()
	TeamManager:ShuffleTeams()
	MapManager:ClearMap()
	MapManager:LoadMap()
	
end

-- Bind Events
CaptureFlag.Event:connect(OnCaptureFlag)
ReturnFlag.Event:connect(OnReturnFlag)

return GameManager
