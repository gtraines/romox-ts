-- This might have been installed in Lua 5.1 .luarocks so make sure to set the version correctly

local _testMain = require("TestMain")
local game = _testMain.game
local habitat = _testMain.habitat
local ServerScriptService = _testMain.ServerScriptService

-- load ServiceFinder within habitat?
local libFinder = habitat:require(ServerScriptService:FindFirstChild("Finders"):FindFirstChild("LibFinder"))
assert(libFinder ~= nil, "Didn't load libFinder")
local DomainFinder = habitat:require(ServerScriptService.Finders.DomainFinder)

local StateMachineMachine = libFinder:FindLib("statemachinemachine")
local internalSharedData = {
    ReadyForSecondStateA = false
}
local firstStateCompleted = false

local stateMachine = StateMachineMachine.NewStateMachine()

local firstState = StateMachineMachine.NewState("FirstState")
firstState.NextStatesNames = { "SecondStateA", "SecondStateB" }
firstState.InternalData = internalSharedData
function firstState:CanTransitionFrom(previousState, data)
    if previousState ~= nil and previousState["Name"] ~= nil then
        print(" Previous State: " .. previousState.Name)
    end
    -- This ensures it won't loop infinitely
    return previousState.Name == "FourthState"
end
function firstState:Action()
    self.InternalData.ReadyForSecondStateA = true
    self:PrintInternalDataTable()
end
function firstState:CanPerformAction()
    return true
end
function firstState:StateStoppedCallback()
    firstStateCompleted = true
    print("First state completed? "  .. tostring(firstStateCompleted))
end

local secondStateA = StateMachineMachine.NewState("SecondStateA")
secondStateA.NextStatesNames = { "ThirdState" }
secondStateA.InternalData = internalSharedData
function secondStateA:CanTransitionFrom(previousState, data)
    if previousState.Name == "FirstState" and data["ReadyForSecondStateA"] then
        return true
    end
    return false
end
function secondStateA:Action()
    self.InternalData.ReadyForThirdState = true
    self:PrintInternalDataTable()
end
function secondStateA:CanPerformAction()
    return true
end
function secondStateA:StateStoppedCallback()
    print("SecondStateA stopped")
end

local secondStateB = StateMachineMachine.NewState("SecondStateB")
secondStateB.NextStatesNames = { "ThirdState" }
secondStateB.InternalData = internalSharedData
function secondStateB:CanTransitionFrom(previousState, data)
    if data["ReadyForSecondStateB"] then
        return true
    end
    return false
end
function secondStateB:Action()
    self.InternalData.ReadyForThirdState = false
    self:PrintInternalDataTable()
end
function secondStateB:CanPerformAction()
    return true
end

local thirdState = StateMachineMachine.NewState("ThirdState")
thirdState.NextStatesNames = { "FirstState" }
thirdState.InternalData = internalSharedData
function thirdState:CanTransitionFrom(previousState, data)
    print(" -- Data passed to third state:")
    for name, thing in pairs(data) do
        print(tostring(name) .. ": " .. tostring(thing))
    end
    if data["ReadyForThirdState"] then
        return true
    end
    return false
end
function thirdState:Action()
    self.InternalData.ReadyForFirstState = true
    self:PrintInternalDataTable()
end

function thirdState:CanPerformAction()
    return true
end
function thirdState:StateStoppedCallback()
    print("Third state stopped")
end

stateMachine:AddState(firstState)
stateMachine:AddState(secondStateA)
stateMachine:AddState(secondStateB)
stateMachine:AddState(thirdState)
stateMachine.CurrentState = firstState

local firstRunData = {}
stateMachine:Update(firstRunData)
print("*** Running second update ***")

local inputData = { ReadyForSecondStateA = true }
stateMachine:Update(inputData)
-- Should be ready for third state
print("*** Running third update ***")
stateMachine:Update({ ReadyForThirdState  = true})

-- Should re-run third state
stateMachine:Update(internalSharedData)

assert(stateMachine.CurrentState.Name == "ThirdState")