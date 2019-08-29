local MapManager = {}

-- Local Variables
local MapSave = Instance.new('Folder', game.ServerStorage)
MapSave.Name = 'MapSave'

-- Initialization

local MapPurgeProof = game.Workspace:FindFirstChild('MapPurgeProof')
if not MapPurgeProof then
	MapPurgeProof = Instance.new('Folder', game.Workspace)
	MapPurgeProof.Name = 'MapPurgeProof'
end

-- Functions

function MapManager:SaveMap()
	for _, child in ipairs(game.Workspace:GetChildren()) do
		if not child:IsA('Camera') and not child:IsA('Terrain') and not child:IsA('Folder') then
			local copy = child:Clone()
			if copy then
				copy.Parent = MapSave
			end	
		end
	end
end

function MapManager:ClearMap()
	for _, child in ipairs(game.Workspace:GetChildren()) do
		if not child:IsA('Camera') and not child:IsA('Terrain') and not child:IsA('Folder') then
			child:Destroy()
		end
	end
end

function MapManager:LoadMap()
	spawn(function()
		for _, child in ipairs(MapSave:GetChildren()) do
			local copy = child:Clone()
			copy.Parent = game.Workspace
		end
	end)
end
	
return MapManager
