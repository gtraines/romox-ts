local ServerScriptService = game:GetService("ServerScriptService")
local Workspace = game:GetService("Workspace")

local findersFolder = ServerScriptService:WaitForChild("Finders", 2)
local DomainFinder = require(findersFolder:WaitForChild("DomainFinder", 2))
local exNihilo = DomainFinder:FindDomain("exnihilo")

local agentsFolder = ServerScriptService:WaitForChild("Agents", 2)
local pathfindingAi = require(agentsFolder:WaitForChild("PathfindingAiBase"))
local npcNames = require(agentsFolder:WaitForChild("NpcNames"))

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local require = require(ReplicatedStorage:WaitForChild("Nevermore"))

local _ = require("rodash")
local destinations = require("destinations")
local std = require("Std")
local rq = std.rquery
local randumb = std.randumb

local module = {

}

function module.ChooseRandomSpawnLocation()
    local wsChildren = Workspace:GetChildren()
	local spawnLocations = {}

	for _, child in pairs(wsChildren) do
		if child.Name == "SpawnLocation" then
			table.insert(spawnLocations, child)
		end
	end

    local foundLocation = destinations.GetRandomCFrameFromTableOfParts(spawnLocations) + Vector3.new(0, 10, 0)
    
	return foundLocation
end

function module.SpawnPersonage(storageFolder,
	personagePrototypeId,
	spawnLocation,
	onSpawnCompleteCallback)

    local spawnedPersonage = Instance.new("Model")

    exNihilo.CreateFromServerStorage(storageFolder,
        personagePrototypeId,
        spawnLocation,
        function(createdPersonage)
            spawnedPersonage = createdPersonage
            spawnedPersonage.Parent = Workspace
            onSpawnCompleteCallback(createdPersonage)
        end)
end

function module.SpawnMaleHumanoid(
	personagePrototypeId,
	spawnLocation,
	onSpawnCompleteCallback)

	local storageFolder = "MaleHumanoids"

    module.SpawnPersonage(storageFolder,
		personagePrototypeId,
		spawnLocation,
		onSpawnCompleteCallback
	)
end

function module.SpawnFemaleHumanoid(
	personagePrototypeId,
	spawnLocation,
	onSpawnCompleteCallback)

	local storageFolder = "FemaleHumanoids"

    module.SpawnPersonage(storageFolder,
        personagePrototypeId,
		spawnLocation,
		onSpawnCompleteCallback
	)
end

function module.FindRandomZombie()
    local npcFolderContents = Workspace:WaitForChild("Npcs"):GetChildren()
	local zombies = _.filter(npcFolderContents, function ( entry )
		return _.endsWith(entry.Name, "Zombie")
	end)

    local selectedZombie = randumb:GetOneAtRandom(zombies)
    
    return selectedZombie
end

function module.GetRandomZombieRootPart()

    local selectedZombie = module.FindRandomZombie
    local rootPart =  selectedZombie:WaitForChild("HumanoidRootPart")
    return rootPart
end

function module.CreateRunner(gender, npcName, personagePrototypeId)
    
	local spawnLocation = module.ChooseRandomSpawnLocation()
    
    local destination = module.GetRandomZombieRootPart()
	
	local onSpawnCompleteCallback = function (createdPersonage)
		local aiInstance = pathfindingAi.new(createdPersonage)
		createdPersonage.Name = npcName
		print("Personage spawned: " .. createdPersonage.Name)
		local goGoGo = aiInstance:MoveTo(destination , true)
	end

    local storageFolder = "" 
    if gender == "F" then 
        storageFolder = "FemaleHumanoids"
    else
        storageFolder = "MaleHumanoids"
    end

    module.SpawnPersonage(storageFolder,
        personagePrototypeId,
		spawnLocation,
		onSpawnCompleteCallback
	)
end

function module.CreateFemaleRunner()
    local personagePrototypeId = "GenericFemale3"
    local name = npcNames.GetFemaleName().FullName
    
    module.CreateRunner("F", name, personagePrototypeId)
end


function module.MaleRunner()
    local personagePrototypeId = "GenericMale"
    local name = npcNames.GetMaleName().FullName
    
    module.CreateRunner("M", name, personagePrototypeId)
end

