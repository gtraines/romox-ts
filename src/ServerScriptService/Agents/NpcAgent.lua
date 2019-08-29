local ServerScriptService = game:GetService("ServerScriptService")
local Workspace = game:GetService("Workspace")

local findersFolder = ServerScriptService:WaitForChild("Finders", 2)
local LibFinder = require(findersFolder:WaitForChild("LibFinder", 2))
local DomainFinder = require(findersFolder:WaitForChild("DomainFinder", 2))

local rq = LibFinder:FindLib("rquery")
local randumb = LibFinder:FindLib("randumb")
local exNihilo = DomainFinder:FindDomain("exnihilo")

local agentsFolder = ServerScriptService:WaitForChild("Agents", 2)
local pathfindingAi = require(agentsFolder:WaitForChild("PathfindingAiBase"))
local npcNames = require(agentsFolder:WaitForChild("NpcNames"))

local require = require(game:GetService("ReplicatedStorage"):WaitForChild("Nevermore"))
local _ = require("rodash")

local agent = {
    ManagedEntities = {}
}

function agent.GetRandomCFrameFromTableOfParts(candidatePartsTable)

	local chosenPart = randumb:GetOneAtRandom(candidatePartsTable)

	if chosenPart ~= nil then
        return CFrame.new(chosenPart.Position)
    end
    error("Unable to select a part from candidates table")
    return nil
end

function agent.ChooseRandomSpawnLocation()
    local wsChildren = Workspace:GetChildren()
	local spawnLocations = {}

	for _, child in pairs(wsChildren) do
		if child.Name == "SpawnLocation" then
			--print("Yes")
			table.insert(spawnLocations, child)
		end
	end

	local foundLocation = agent.GetRandomCFrameFromTableOfParts(spawnLocations) + Vector3.new(0, 10, 0)
	print("Found a location: " .. tostring(foundLocation))

	return foundLocation
end

function agent.SpawnPersonageAsAgent(storageFolder,
	personagePrototypeId,
	spawnLocation,
	personageAi,
	onSpawnCompleteCallback)

    local spawnedPersonage = Instance.new("Model")

    exNihilo.CreateFromServerStorage(storageFolder,
        personagePrototypeId,
        spawnLocation,
        function(createdPersonage)
            spawnedPersonage = createdPersonage
            spawnedPersonage.Parent = Workspace
            agent.ManagedEntities[rq.GetOrAddEntityId(spawnedPersonage)] = spawnedPersonage
            onSpawnCompleteCallback(createdPersonage)
        end)
end

function agent.SpawnMaleHumanoidAsAgent(
	personagePrototypeId,
	spawnLocation,
	personageAi,
	onSpawnCompleteCallback)

	local storageFolder = "MaleHumanoids"

    agent.SpawnPersonageAsAgent(storageFolder,
		personagePrototypeId,
		spawnLocation,
		personageAi,
		onSpawnCompleteCallback
	)
end

function agent.SpawnFemaleHumanoidAsAgent(
	personagePrototypeId,
	spawnLocation,
	personageAi,
	onSpawnCompleteCallback)

	local storageFolder = "FemaleHumanoids"

    agent.SpawnPersonageAsAgent(storageFolder,
        personagePrototypeId,
		spawnLocation,
		personageAi,
		onSpawnCompleteCallback
	)
end

function agent.CreateFemaleRunner()
	local personagePrototypeId = "GenericFemale3"
	local spawnLocation = agent.ChooseRandomSpawnLocation()
	local npcFolderContents = Workspace:WaitForChild("Npcs"):GetChildren()
	local zombies = _.filter(npcFolderContents, function ( entry )
		return _.endsWith(entry.Name, "Zombie")
	end)

	local selectedZombie = randumb:GetOneAtRandom(zombies)
	local destination =  selectedZombie:WaitForChild("HumanoidRootPart")

	local onSpawnCompleteCallback = function (createdPersonage)
		local aiInstance = pathfindingAi.new(createdPersonage)
		createdPersonage.Name = npcNames.GetFemaleName().FullName
		print("Personage spawned: " .. createdPersonage.Name)
		local goGoGo = aiInstance:MoveTo(destination , true)
	end

	agent.SpawnFemaleHumanoidAsAgent(
		personagePrototypeId,
		spawnLocation,
		nil,
		onSpawnCompleteCallback)
end

function agent.CreateMaleRunner()

	local personagePrototypeId = "GenericMale"
	local spawnLocation = agent.ChooseRandomSpawnLocation()
	local npcFolderContents = Workspace:WaitForChild("Npcs"):GetChildren()
	local zombies = _.filter(npcFolderContents, function ( entry )
		return _.endsWith(entry.Name, "Zombie")
	end)

	local selectedZombie = randumb:GetOneAtRandom(zombies)
	local destination = selectedZombie:WaitForChild("HumanoidRootPart")

	local onSpawnCompleteCallback = function (createdPersonage)
		local aiInstance = pathfindingAi.new(createdPersonage)
		createdPersonage.Name = npcNames.GetMaleName().FullName
		print("Personage spawned: " .. createdPersonage.Name)
		local goGoGo = aiInstance:MoveTo(destination , true)
	end

	agent.SpawnMaleHumanoidAsAgent(
		personagePrototypeId,
		spawnLocation,
		nil,
		onSpawnCompleteCallback)
end

return agent