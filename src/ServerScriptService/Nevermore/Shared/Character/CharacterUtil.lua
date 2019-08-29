--- General character utility code.
-- @module CharacterUtil

local Players = game:GetService("Players")

local CharacterUtil = {}

function CharacterUtil.GetPlayerHumanoid(player)
	local character = player.Character
	if not character then
		return nil
	end

	return character:FindFirstChildOfClass("Humanoid")
end

function CharacterUtil.GetAlivePlayerHumanoid(player)
	local humanoid = CharacterUtil.GetPlayerHumanoid(player)
	if not humanoid or humanoid.Health <= 0 then
		return nil
	end

	return humanoid
end

function CharacterUtil.GetAlivePlayerRootPart(player)
	local humanoid = CharacterUtil.GetPlayerHumanoid(player)
	if not humanoid or humanoid.Health <= 0 then
		return nil
	end

	return humanoid.RootPart
end

function CharacterUtil.GetPlayerRootPart(player)
	local humanoid = CharacterUtil.GetPlayerHumanoid(player)
	if not humanoid then
		return nil
	end

	return humanoid.RootPart
end

function CharacterUtil.UnequipTools(player)
	local humanoid = CharacterUtil.GetPlayerHumanoid(player)
	if humanoid then
		humanoid:UnequipTools()
	end
end

--- Returns the Player and Character that a descendent is part of, if it is part of one.
-- @param descendant A child of the potential character.
-- @treturn Player player
-- @treturn Character charcater
function CharacterUtil.GetPlayerFromCharacter(descendant)
	local character = descendant
	local player = Players:GetPlayerFromCharacter(character)

	while not player do
		if character.Parent then
			character = character.Parent
			player = Players:GetPlayerFromCharacter(character)
		else
			return nil
		end
	end

	return player
end

function CharacterUtil.GetPersonageFromPart(part)
	if part.Parent == nil then return end
	
	for _, value in pairs(game:GetService("Players"):GetPlayers()) do
		if value.Character then
			if part:IsDescendantOf(value.Character) then
				return value.Character
			end
		end
	end
	
	--ok so this might be an npc
	local par = part
	
	repeat
		par = par.Parent
		
		if par:FindFirstChild("Humanoid") then
			return par
		end
	until par:IsA("Model") or par:IsA("Workspace") --workspace is a model but whatever jic they make it not a model idk
end


return CharacterUtil