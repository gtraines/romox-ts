local ReplicatedStorage = game:GetService("ReplicatedStorage")
local SharedFolder = ReplicatedStorage:WaitForChild("Shared", 1)

local module = {
    ComponentBase = require(SharedFolder:WaitForChild("componentbase", 2)),
    EzConfig = require(SharedFolder:WaitForChild("easyconfig", 2)),
    Pathfinder = require(SharedFolder:WaitForChild("pathfinder", 2)),
    PubSub = require(SharedFolder:WaitForChild("pubsub", 2)),
    RQuery = require(SharedFolder:WaitForChild("rquery", 2)),
    StateMachineMachine = require(SharedFolder:WaitForChild("stateMachineMachine", 2))
}

return module
