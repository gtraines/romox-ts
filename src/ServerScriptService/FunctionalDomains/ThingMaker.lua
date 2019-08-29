-- Assemble pieces into a person

-- get a basic person

-- add a shirt 
-- pants

-- personality?
-- tools + ability

-- set health
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local rq = require(ReplicatedStorage:WaitForChild("LibFinder", 2):FindLib("rquery"))
local exNihilo = require(ServerScriptService:WaitForChild("FunctionalDomains"):WaitForChild("ExNihilo"))

local require = require(game:GetService("ReplicatedStorage"):WaitForChild("Nevermore"))
local _  = require("rodash")


local module = {}

function module.HasHumanoid(personage)
    local hasHumanoid = _.any(personage:GetChildren(),
        function (entry)
            return entry.Name == "Humanoid" or entry:IsA("Humanoid")
        end)
        
    return hasHumanoid ~= nil and hasHumanoid
end

function module.GetHumanoidFromPersonage( personage )
    if not module.HasHumanoid( personage ) then
        error("Not a personage: " .. personage.Name)
        return nil
    end
    
    local humanoid = _.find(personage:GetChildren(), function(part) 
        return part.Name == "Humanoid" or part:IsA("Humanoid")
    end)

    return humanoid
end

function module.IsPersonageR6( personage )
    local humanoid = module.GetHumanoidFromPersonage(personage)

    if humanoid.HumanoidRigType == 0 then
        return true
    end

    return false
end

function module.AddDefaultR6Animations( personage )
    
    local humanoid = module.GetHumanoidFromPersonage(personage)

        humanoid.Died:Connect(onDied)
        humanoid.Running:Connect(onRunning)
        humanoid.Jumping:Connect(onJumping)
        humanoid.Climbing:Connect(onClimbing)
        humanoid.GettingUp:Connect(onGettingUp)
        humanoid.FreeFalling:Connect(onFreeFall)
        humanoid.FallingDown:Connect(onFallingDown)
        humanoid.Seated:Connect(onSeated)
        humanoid.PlatformStanding:Connect(onPlatformStanding)
        humanoid.Swimming:Connect(onSwimming)
    
end

function module.SpawnPersonageAsync(storageFolder, 
        personagePrototypeId, 
        spawnLocation,
        onSpawnCompleteCallback, targetFolder)
    
        exNihilo.CreateFromServerStorage(storageFolder, 
            personagePrototypeId,
            spawnLocation, 
            function(createdPersonage)
                onSpawnCompleteCallback(createdPersonage)
            end, targetFolder)
end

function module.GetStorageFolderForGender(gender)
    local storageFolder = ""
    if _.startsWith(gender, "M") then
        storageFolder = "MaleHumanoids"
    else
        storageFolder = "FemaleHumanoids"
    end

    return storageFolder
end

function module.GetPersonageFactoryAsync(gender, personagePrototypeId, recipe)
    recipe = recipe or { "" }

    local function createUsingRecipe(onSpawnCompleteCallback)
        local storageFolder = module.GetStorageFolderForGender(gender)
        local targetFolder = rq.GetOrAddItem("Npcs", "Folder", game:GetService("Workspace"))

        local Workspace = game:GetService("Workspace"):FindFirstChild("Npcs")
        return module.SpawnPersonage(storageFolder)
    end 
end

return module