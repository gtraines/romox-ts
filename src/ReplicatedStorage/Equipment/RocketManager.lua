local RocketManager = {}

-- ROBLOX Services
local Players = game.Players

-- Local Variables
local Player = game.Players.LocalPlayer
local Tool = script.Parent.Parent
local HitPlayer = Tool:WaitForChild('HitPlayers')
local DirectHitPlayer = Tool:WaitForChild('DirectHitPlayer')
local Configurations = Tool.Configuration

function RocketManager:BindRocketEvents(rocket)
	local exploded = false
	
	rocket.PrimaryPart.Touched:connect(function(otherPart)
		if not otherPart:IsDescendantOf(Player.Character) and not exploded then
			exploded = true
			rocket.PrimaryPart.LocalTransparencyModifier = 1
			Tool.RocketHit:FireServer(rocket, rocket.PrimaryPart.Position)
			local collision = Instance.new('Part')
			collision.Anchored = true
			collision.CanCollide = false
			collision.Position = rocket.PrimaryPart.Position
			collision.FormFactor = Enum.FormFactor.Custom
			collision.Shape = Enum.PartType.Ball
			collision.Size = Vector3.new(1,1,1) * Configurations.BlastRadius.Value * 2
			collision.Parent = game.Workspace
			collision.CanCollide = true
			local hitPlayers = {}
			local hitParts = collision:GetTouchingParts()
			collision:Destroy()
			local player = Players:GetPlayerFromCharacter(otherPart.Parent)
			if player then DirectHitPlayer:FireServer(player.userId) end
			for _, hitPart in ipairs(hitParts) do
				local player = Players:GetPlayerFromCharacter(hitPart.Parent)
				if player and not hitPlayers[tostring(player.userId)] then hitPlayers[tostring(player.userId)] = true end
			end
			HitPlayer:FireServer(hitPlayers)
		end
	end)
end

return RocketManager
