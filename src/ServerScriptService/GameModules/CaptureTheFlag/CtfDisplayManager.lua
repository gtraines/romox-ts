local DisplayManager = {}

-- ROBLOX Services

local Players = game.Players

-- Local Variables

local Events = game.ReplicatedStorage.Events
local DisplayIntermission = Events.DisplayIntermission
local DisplayNotification = Events.DisplayNotification
local DisplayTimerInfo = Events.DisplayTimerInfo
local DisplayVictory = Events.DisplayVictory
local DisplayScore = Events.DisplayScore
local StarterGui = game.StarterGui

-- Initialize
StarterGui.ResetPlayerGuiOnSpawn = false
local MapPurgeProof = game.Workspace:FindFirstChild('MapPurgeProof')
if not MapPurgeProof then
	MapPurgeProof = Instance.new('Folder', game.Workspace)
	MapPurgeProof.Name = 'MapPurgeProof'
end

-- Public Functions

function DisplayManager:StartIntermission(player)
	if player then
		DisplayIntermission:FireClient(player, true)
	else
		DisplayIntermission:FireAllClients(true)
	end
end

function DisplayManager:StopIntermission(player)
	if player then
		DisplayIntermission:FireClient(player, false)
	else
		DisplayIntermission:FireAllClients(false)
	end
end

function DisplayManager:DisplayNotification(teamColor, message)
	DisplayNotification:FireAllClients(teamColor, message)
end

function DisplayManager:UpdateTimerInfo(isIntermission, waitingForPlayers)
	DisplayTimerInfo:FireAllClients(isIntermission, waitingForPlayers)
end

function DisplayManager:DisplayVictory(winningTeam)
	DisplayVictory:FireAllClients(winningTeam)
end

function DisplayManager:UpdateScore(team, score)
	DisplayScore:FireAllClients(team, score)
end

return DisplayManager
