local PlayerManager = {}

-- ROBLOX Services
local Players = game.Players
local PointsService = game:GetService('PointsService')

-- Game services
local Configurations = require(game.ServerStorage.Configurations)
local Events = game.ReplicatedStorage.Events
local ResetMouseIcon = Events.ResetMouseIcon
local TeamManager = require(script.Parent.TeamManager)
local DisplayManager = require(script.Parent.DisplayManager)

-- Local variables
local PlayersCanSpawn = false
local GameRunning = false

-- Local Functions
local function OnPlayerAdded(player)
	-- Setup leaderboard stats
	local leaderstats = Instance.new('Model', player)
	leaderstats.Name = 'leaderstats'
	
	local Captures = Instance.new('IntValue', leaderstats)
	Captures.Name = 'Captures'
	Captures.Value = 0
	
	-- Add player to team
	TeamManager:AssignPlayerToTeam(player)
	
	player.CharacterAdded:connect(function(character)
		character:WaitForChild('Humanoid').Died:connect(function()
			wait(Configurations.RESPAWN_TIME)
			if GameRunning then
				player:LoadCharacter()
			end
		end)
	end)	
	
	-- Check if player should be spawned	
	if PlayersCanSpawn then
		player:LoadCharacter()
	else
		DisplayManager:StartIntermission(player)
	end	

end

local function OnPlayerRemoving(player)
	TeamManager:RemovePlayer(player)
end

-- Public Functions

function PlayerManager:SetGameRunning(running)
	GameRunning = running
end

function PlayerManager:ClearPlayerScores()
	for _, player in ipairs(Players:GetPlayers()) do
		local leaderstats = player:FindFirstChild('leaderstats')
		if leaderstats then
			local Captures = leaderstats:FindFirstChild('Captures')
			if Captures then
				Captures.Value = 0
			end
		end
	end
end

function PlayerManager:LoadPlayers()
	for _, player in ipairs(Players:GetPlayers()) do
		player:LoadCharacter()
	end
end

function PlayerManager:AllowPlayerSpawn(allow)
	PlayersCanSpawn = allow
end

function PlayerManager:DestroyPlayers()
	for _, player in ipairs(Players:GetPlayers()) do
		player.Character:Destroy()
		for _, item in ipairs(player.Backpack:GetChildren()) do
			item:Destroy()
		end
	end
	ResetMouseIcon:FireAllClients()
end

function PlayerManager:AddPlayerScore(player, score)
	player.leaderstats.Captures.Value = player.leaderstats.Captures.Value + score
	local success, message = pcall(function() spawn(function() PointsService:AwardPoints(player.userId, score) end) end)
end

-- Event binding
Players.PlayerAdded:connect(OnPlayerAdded)
Players.PlayerRemoving:connect(OnPlayerRemoving)

return PlayerManager