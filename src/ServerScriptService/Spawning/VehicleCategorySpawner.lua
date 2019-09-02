local DomainFinder = require(game
    :GetService("ServerScriptService")
    :WaitForChild("Finders", 5)
    :WaitForChild("DomainFinder", 2))

local spieler = DomainFinder:FindDomain("spieler")
local carAndDriver = DomainFinder:FindDomain("CarAndDriver")

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local require = require(ReplicatedStorage:WaitForChild("Nevermore", 2))
local std = require("Std")

local wraptor = std.wraptor
local linq = std.linq
local rq = std.rquery

local module = {}

function module:GetSpawnerModels(categoryName)
    local wsRoot = game:WaitForChild("Workspace", 1)
    -- Get Spawners

    local spawnersFolder = wsRoot:WaitForChild("Spawners", 1)
    local vehicleSpawners = spawnersFolder:WaitForChild(categoryName, 1)
    local spawnerModels = linq(vehicleSpawners:GetChildren()):where(
        function (item) return item:FindFirstChild("Touchstone") ~= nil end)

    return spawnerModels.list()
end

function module.TouchedByAPlayerClosure(spawnerModel, touchedByPlayerDelegate)

    local touchHandler = function(part)
        local playerFromPart = spieler:GetPlayerFromPart(part)
        if (playerFromPart ~= nil) then
            return touchedByPlayerDelegate(spawnerModel, playerFromPart)
        end
    end

    return wraptor.WithCoolDown(5, touchHandler)
end

function module._vehicleSpawnerTouchedDelegate(spawnerModel, playerFromPart)
    print(
        "ALERT: " .. playerFromPart.Name .. " just touched me."
    )
    local prototypeToSpawn = rq.StringValueOrNil("SpawnsPrototypeId", spawnerModel)
    local touchStone = spawnerModel:FindFirstChild("SpawnPad")
    local spawnLocation = CFrame.new(touchStone.Position) + Vector3.new(0, 3, 0)
    return carAndDriver.CreateVehicleFromServerStorage(prototypeToSpawn, spawnLocation)
end

function module:ConfigureSpawners()
    
    for spwnrMdl in self:GetSpawnerModels("VehicleSpawners") do
        print(spwnrMdl)
        spwnrMdl:FindFirstChild("Touchstone").Touched:Connect(
            module.TouchedByAPlayerClosure(spwnrMdl, module._vehicleSpawnerTouchedDelegate)
        )
    end
end

function module:Init()
    self:ConfigureSpawners()
end

return module