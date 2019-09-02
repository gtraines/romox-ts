-- ROBLOX services
local Players = game:GetService("Players")
local ServerScriptService = game:GetService("ServerScriptService")
local findersFolder = ServerScriptService:WaitForChild("Finders")
local DomainFinder = require(findersFolder:WaitForChild("DomainFinder", 2))

-- Game services
local TeamManager = DomainFinder:FindDomain("TeamManager")
local PlayerManager = DomainFinder:FindDomain("PlayerManager")
local MapManager = DomainFinder:FindDomain("MapManager")
local TimeManager = DomainFinder:FindDomain("TimeManager")
local DisplayManager = DomainFinder:FindDomain("DisplayManager")
local ConfigManager = require(script.Parent:WaitForChild("ConfigManager", 2))


local GameManager = {
	ConfigValues = {},
	GameConfigKeys = {
		INTERMISSION_DURATION = "INTERMISSION_DURATION",
		MIN_PLAYERS = "MIN_PLAYERS",
		ROUND_DURATION = "ROUND_DURATION",
		END_GAME_WAIT = "END_GAME_WAIT"
	},
	FeatureFlagValues = {},
	FeatureFlagKeys = {
		UseVehicleSpawners = "UseVehicleSpawners",
		UseNpcSpawners = "UseNpcSpawners",
		IsCaptureTheFlag = "IsCaptureTheFlag",
		UseSaveMap = "UseSaveMap",
		UseGameRounds = "UseGameRounds",
		AssignTeams = "AssignTeams"
	}
}

-- Local Variables
local IntermissionRunning = false
local EnoughPlayers = false
local GameRunning = false
local Events = game.ReplicatedStorage.Events
local CaptureFlag = Events.CaptureFlag
local ReturnFlag = Events.ReturnFlag

-- Local Functions
local function OnCaptureFlag(player)
	PlayerManager:AddPlayerScore(player, 1)
	TeamManager:AddTeamScore(player.TeamColor, 1)
	DisplayManager:DisplayNotification(player.TeamColor, 'Captured Flag!')
end

local function OnReturnFlag(flagColor)
	DisplayManager:DisplayNotification(flagColor, 'Flag Returned!')
end

-- Public Functions
function GameManager:GetConfigValue(configKey)
	if self.ConfigValues[configKey] ~= nil then
		return self.ConfigValues[configKey]
	end
	local configValue = ConfigManager:GetConfigValueOrDefault(configKey)
	if configValue ~= nil then
		self.ConfigValues[configKey] = configValue
	end
	return configValue
end

function GameManager:GetFeatureFlagValue(featureFlagKey)
	if self.FeatureFlagValues[featureFlagKey] ~= nil then
		return self.FeatureFlagValues[featureFlagKey]
	end
	local featureFlagValue = ConfigManager:GetFeatureEnabled(featureFlagKey)
	if featureFlagValue ~= nil then
		self.FeatureFlagValues[featureFlagKey] = featureFlagValue
	end
	return featureFlagValue
end

function GameManager:LoadConfigValues()
	ConfigManager:Init()
	for key, val in pairs(self.GameConfigKeys) do
		self.ConfigValues[key] = ConfigManager:GetConfigValueOrDefault(val)
	end
	for key, val in pairs(self.FeatureFlagKeys) do
		self.FeatureFlagValues[key] = ConfigManager:GetFeatureEnabled(val)
	end
end

function GameManager:Initialize()
	self:LoadConfigValues()
	if self.FeatureFlagValues[self.FeatureFlagKeys.UseSaveMap] then
		MapManager:SaveMap()
	end
	-- Bind Events
	if self:GetFeatureFlagValue(self.FeatureFlagKeys.IsCaptureTheFlag) then
		CaptureFlag.Event:connect(OnCaptureFlag)
		ReturnFlag.Event:connect(OnReturnFlag)
	end
end

function GameManager:RunIntermission()
	IntermissionRunning = false
	if not self:GetFeatureFlagValue(self.FeatureFlagKeys.UseGameRounds) then
		return
	end

	IntermissionRunning = true
	local MIN_PLAYERS = self:GetConfigValue(self.GameConfigKeys.MIN_PLAYERS)
	local INTERMISSION_DURATION = self:GetConfigValue(self.GameConfigKeys.INTERMISSION_DURATION)
	TimeManager:StartTimer(INTERMISSION_DURATION)
	DisplayManager:StartIntermission()
	EnoughPlayers = Players.NumPlayers >= MIN_PLAYERS
	DisplayManager:UpdateTimerInfo(true, not EnoughPlayers)
	spawn(function()
		repeat
			if EnoughPlayers and Players.NumPlayers < MIN_PLAYERS then
				EnoughPlayers = false
			elseif not EnoughPlayers and Players.NumPlayers >= MIN_PLAYERS then
				EnoughPlayers = true
			end
			DisplayManager:UpdateTimerInfo(true, not EnoughPlayers)
			wait(.5)
		until IntermissionRunning == false
	end)

	wait(INTERMISSION_DURATION)
	IntermissionRunning = false
end

function GameManager:StopIntermission()
	--IntermissionRunning = false
	DisplayManager:UpdateTimerInfo(false, false)
	DisplayManager:StopIntermission()
end

function GameManager:GameReady()
	return Players.NumPlayers >= self:GetConfigValue(self.GameConfigKeys.MIN_PLAYERS)
end

function GameManager:StartRound()
	TeamManager:ClearTeamScores()
	PlayerManager:ClearPlayerScores()

	PlayerManager:AllowPlayerSpawn(true)
	PlayerManager:LoadPlayers()

	GameRunning = true
	PlayerManager:SetGameRunning(true)
	if self:GetFeatureFlagValue(self.FeatureFlagKeys.UseGameRounds) then
		TimeManager:StartTimer(self:GetConfigValue(self.GameConfigKeys.ROUND_DURATION))
	end
	
end

function GameManager:Update()
	--TODO: Add custom custom game code here

end

function GameManager:RoundOver()
	if self:GetFeatureFlagValue(self.FeatureFlagKeys.UseGameRounds) then
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
	end
	return false
end

function GameManager:RoundCleanup()
	if self:GetFeatureFlagValue(self.FeatureFlagKeys.UseGameRounds) then
		PlayerManager:SetGameRunning(false)
		wait(self:GetConfigValue(self.GameConfigKeys.END_GAME_WAIT))

		PlayerManager:AllowPlayerSpawn(false)
		PlayerManager:DestroyPlayers()
		DisplayManager:DisplayVictory(nil)
		TeamManager:ClearTeamScores()
		PlayerManager:ClearPlayerScores()

		if self:GetFeatureFlagValue(self.FeatureFlagKeys.AssignTeams) then
			TeamManager:ShuffleTeams()
		end
		if self:GetFeatureFlagValue(self.FeatureFlagKeys.UseSaveMap) then
			MapManager:ClearMap()
			MapManager:LoadMap()
		end
	end
end

return GameManager
