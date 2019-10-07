--[[
	All configurations are located in the "Settings" Module script.
	Please don't edit this script unless you know what you're doing.
--]]

local Tycoons = {}
local Teams = game:GetService('Teams')
local Settings = require(script.Parent.Settings)
local BC = BrickColor
local Storage = Instance.new('Folder', game.ServerStorage)
Storage.Name = "PlayerMoney"
Instance.new('Model',workspace).Name = "PartStorage" --  parts dropped go in here to be killed >:)

function returnColorTaken(color)
	for i,v in pairs(Teams:GetChildren()) do
		if v:IsA('Team') then
			if v.TeamColor == color then
				return true
			end
		end
	end
	return false
end
--run this first so if there is a 'white' team it is switched over
if not Settings['AutoAssignTeams'] then
	local teamHire = Instance.new('Team', Teams)
	teamHire.TeamColor = BC.new('White')
	teamHire.Name = "For Hire"
end

for i,v in pairs(script.Parent:WaitForChild('Tycoons'):GetChildren()) do
	Tycoons[v.Name] = v:Clone() -- Store the tycoons then make teams depending on the tycoon names
	if returnColorTaken(v.TeamColor) then
		--//Handle duplicate team colors
		local newColor;
		repeat
			wait()
			newColor = BC.Random()
		until returnColorTaken(newColor) == false
		v.TeamColor.Value = newColor
	end
	--Now that there are for sure no duplicates, make your teams
	local NewTeam = Instance.new('Team',Teams)
	NewTeam.Name = v.Name
	NewTeam.TeamColor = v.TeamColor.Value
	if not Settings['AutoAssignTeams'] then
		NewTeam.AutoAssignable = false
	end
	v.PurchaseHandler.Disabled = false
end

function getPlrTycoon(player)
	for i,v in pairs(script.Parent.Tycoons:GetChildren()) do
		if v:IsA("Model") then
			if v.Owner.Value == player then
				return v
			end
		end
	end
	return nil
end

game.Players.PlayerAdded:connect(function(player)
	local plrStats = Instance.new("NumberValue",game.ServerStorage.PlayerMoney)
	plrStats.Name = player.Name
	local isOwner = Instance.new("ObjectValue",plrStats)
	isOwner.Name = "OwnsTycoon"
end)

game.Players.PlayerRemoving:connect(function(player)
	local plrStats = game.ServerStorage.PlayerMoney:FindFirstChild(player.Name)
	if plrStats ~= nil then
		plrStats:Destroy()
	end
	local tycoon = getPlrTycoon(player)
	if tycoon then
		local backup = Tycoons[tycoon.Name]:Clone()
		tycoon:Destroy()
		wait()
		backup.Parent=script.Parent.Tycoons
	end
end)
