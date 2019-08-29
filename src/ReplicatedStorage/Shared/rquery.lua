local ReplicatedStorage = game:GetService("ReplicatedStorage")
local PlayersService = game:GetService("Players")
--local t = require(script.Parent.Parent.lib.t)

local uuid = require(ReplicatedStorage:WaitForChild("Std", 1):WaitForChild("uuid", 1))

local module = {}

function module.CreateFolder( folderName, parentObjectInstance )
	local folderInst = Instance.new("Folder")
	folderInst.Name = folderName
	folderInst.Parent = parentObjectInstance
	return folderInst
end

function module.FindSiblingNamed( part, siblingName )
	if part.Parent ~= nil then
		if part.Parent:FindFirstChild( siblingName, false ) ~= nil then
			return part.Parent:FindFirstChild( siblingName, false )
		end
	end

	return nil
end

function module.DeepCopyTable(orig)
    local orig_type = type(orig)
    local copy
    if orig_type == 'table' then
        copy = {}
        for orig_key, orig_value in next, orig, nil do
            copy[module.DeepCopyTable(orig_key)] = module.DeepCopyTable(orig_value)
        end
        setmetatable(copy, module.DeepCopyTable(getmetatable(orig)))
    else -- number, string, boolean, etc
        copy = orig
    end
    return copy
end

function module.GetPlayerDrivingVehicle(vehicleModel)
    if vehicleModel ~= nil and
         vehicleModel:FindFirstChild("VehicleSeat") ~= nil and 
         vehicleModel:FindFirstChild("VehicleSeat").Occupant ~= nil then
            local occupantCharacter = vehicleModel:FindFirstChild("VehicleSeat").Occupant.Parent
            local occupantPlayer = PlayersService:GetPlayerFromCharacter(occupantCharacter)
            return occupantPlayer
         end

    return nil
end

function module.PersonageTorsoOrEquivalent(personage)
	local personageTorso = personage:FindFirstChild("Torso")
	if personageTorso == nil then
		personageTorso = personage:FindFirstChild("UpperTorso")
	end
	return personageTorso
end

function module.AttachedHumanoidOrNil(part)
	if part == nil then return nil end
	
	if module.FindSiblingNamed(part, "Humanoid") ~= nil then
		return module.FindSiblingNamed(part, "Humanoid")
	elseif part:FindFirstAncestor("Humanoid") ~= nil then
		return part:FindFirstAncestor("Humanoid")
	elseif part:FindFirstChild( "Humanoid", false ) ~= nil then
		return part:FindFirstChild( "Humanoid", false )
	end
		
	return nil
end

function module.AttachedCharacterOrNil( part )

	local attachedHumanoid = module.AttachedHumanoidOrNil(part)
	if attachedHumanoid ~= nil then
		local character = attachedHumanoid.Parent
		if character ~= nil then
			return character
		end
	end

	return nil
end

function module.GetUserIdString(player)
	--assert(getUserIdCheck(player))
	return tostring(player.UserId)
end
--local getCharacterFromUserIdCheck = t.instanceOf("Model")
function module.GetUserIdFromCharacter(character)
	--assert(getCharacterFromUserIdCheck(character))
	local player = PlayersService:GetPlayerFromCharacter(character)

	if player then
		return  module.GetUserIdString(player)
	end
end
--local getPlayerFromUserCheck = t.string
function module.GetPlayerFromUserId(userId)
	--assert(getPlayerFromUserCheck(userId))

	for _, player in pairs(PlayersService:GetPlayers()) do
		if player.UserId == tonumber(userId) then
			return player
		end
	end
end

--[[
	Gets a character from their player's UserId.
]]
--local getCharacterFromUserIdCheck = t.string
function module.GetCharacterFromUserId(userId)
	--assert(getCharacterFromUserIdCheck(userId))
	local player = module.GetPlayerFromUserId(userId)
	if player then
		return player.Character
	end
end

function module.FolderContentsOrNil( folderName, parent )
	if folderName == nil or parent == nil then return nil end

	local folderCandidate = parent:FindFirstChild(folderName)

	if  folderCandidate ~= nil and folderCandidate:IsA("Folder") then
		return folderCandidate:GetChildren()
	end

	return nil
end

function module.ComponentsFolderOrNil( item )
	return module.FolderContentsOrNil( "Components", item )
end

function module.StringValueOrNil( valueName, parent )
	if valueName == nil or parent == nil then return nil end

	local valueCandidate = parent:FindFirstChild(valueName)
	if valueCandidate ~= nil and valueCandidate:IsA("StringValue") then
		return valueCandidate.Value
	end

	return nil
end

function module.BoolValueOrNil( valueName, parent )
	if valueName == nil or parent == nil then return nil end

	local valueCandidate = parent:FindFirstChild(valueName)
	if valueCandidate ~= nil and valueCandidate:IsA("BoolValue") then
		return valueCandidate.Value
	end

	return nil
end

function module.ObjectValueOrNil( valueName, parent )
	if valueName == nil or parent == nil then return nil end

	local valueCandidate = parent:FindFirstChild(valueName)
	if valueCandidate ~= nil and valueCandidate:IsA("ObjectValue") then
		return valueCandidate.Value
	end

	return nil
end

function module.IntValueOrNil( valueName, parent )
	if valueName == nil or parent == nil then return nil end

	local valueCandidate = parent:FindFirstChild(valueName)
	if valueCandidate ~= nil and valueCandidate:IsA("ObjectValue") then
		return valueCandidate.Value
	end

	return nil
end


function module.GetOrAddItem( itemName, itemType, parent )
	if itemName == nil or itemType == nil or parent == nil then return nil end

	local itemCandidate = parent:FindFirstChild(itemName)
	if itemCandidate == nil then 
		itemCandidate = Instance.new(itemType)
		itemCandidate.Name = itemName
		itemCandidate.Parent = parent
	end
	return itemCandidate
end

function module.GetOrAddEntityId(item)
	local entityIdObj = module.GetOrAddItem( "EntityId", "StringValue", item )

	if entityIdObj.Value == nil or entityIdObj.Value == "" then
		entityIdObj.Value = uuid()
	end
    return entityIdObj.Value
end

function module.Assign( target, ... )
	for i = 1, select("#", ...) do
		local source = select(i, ...)

		for key, value in pairs(source) do
			target[key] = value
		end
	end

	return target
end

return module
