local ReplicatedStorage = game:GetService("ReplicatedStorage")

local rq = require(ReplicatedStorage
	:WaitForChild("Shared", 2):WaitForChild("rquery", 2))
local uuid = require(ReplicatedStorage
	:WaitForChild("Std", 2):WaitForChild("uuid", 2))

local stateProto = {
	__type = "state",
	StateId = nil,
	Name = nil,
	InternalData = {},
	NextStatesNames = {},
	NextStates = {},
	Wait = 0.2,
	IsRunning = false
}

local stateMeta = { __index = stateProto }

function stateProto.new(name)
	local self = setmetatable({}, stateMeta)
	self.Name = name or "UNNAMED_STATE"
	self.StateId = uuid()
	return self
end

function stateProto:PrintInternalDataTable()
    print("------------------------------------")
    print("  Internal data for " .. self.Name)
    for name, value in pairs(self.InternalData) do
        print("    - " .. tostring(name) .. ": ".. tostring(value))
    end
    print("------------------------------------")
end

function stateProto:CanTransitionFrom(previousState, data)
	error("No transition func specified")
end

function stateProto:StateStoppedCallback()
	return
end

function stateProto:CanPerformAction(data)
	error(self.Name .. " missing CanPerformAction() implementation")
end

function stateProto:Action()
	error(self.Name .. " missing Action() implementation")
	return false
end

function stateProto:Init()
	print("Initializing State: " .. self.Name)
end

local machineProto = {
	MachineId = "nil",
	CurrentState = {},
	States = {},
	Context = {
		Items = {}
	}
}
local machineMeta = { __index = machineProto }

function machineProto.new()
	local self = setmetatable({}, machineMeta)
	self.MachineId = uuid()
	return self
end

function machineProto:NewState(stateName)
	local stateInstance = rq.DeepCopyTable(stateProto.new(stateName))
	return stateInstance
end

function machineProto:Stop(stateToStop)
	--print("Stopping " .. state.Name)
	stateToStop.IsRunning = false
	stateToStop:StateStoppedCallback(self.Context)
end

function machineProto:AddState(state)
	self.States[state.Name] = state
	for _, nextStateName in pairs(state.NextStatesNames) do
		if self.States[nextStateName] ~= nil then
			state.NextStates[nextStateName] = self.States[nextStateName]
		end
	end

	for _, existingState in pairs(self.States) do
		for _, nextStateName in pairs(existingState.NextStatesNames) do
			if nextStateName == state.Name then
				existingState.NextStates[nextStateName] = state
			end
		end
	end
end

function machineProto:ClearContextItems()
	for _, item in pairs(self.Context.Items) do
		item = nil
	end
	self.Context.Items = nil
	self.Context.Items = {}
end

function machineProto:TryTransition(data)

	for _, nextState in pairs(self.CurrentState.NextStates) do
		if nextState:CanTransitionFrom(self.CurrentState, self.Context, data) then
			self:Stop(data)
			self:Start(nextState, data)
			return true
		end
	end
	return false
end

function machineProto:Next(data)
	if self.CurrentState:CanPerformAction(data) then
		self.CurrentState:Action()
	else
		self:Update()
	end
	--wait(state.WaitTime)
end

function machineProto:Start(startingState, data)
	if startingState == nil then
		startingState = self.CurrentState
		if startingState == nil then
			error("No state passed and no state set as CurrentState")
			return nil
		end
	end
	self.CurrentState = startingState

	self.CurrentState:Init(self.Context, data)
	local runDelegate = function()
		self:Next()
	end
	local thread = coroutine.create(runDelegate)
	local success, errorMsg = coroutine.resume(thread)
	if success then
		self.CurrentState.IsRunning = true
	else
		error(errorMsg)
		return nil
	end
end

function machineProto:Update( data )
	if self:TryTransition(data) then
		return true
	else
		self:Next(data)
	end
	--wait(self.CurrentState.WaitTime)
end

function machineProto:PrintStateGraph()
	local function printNextStates(stateToPrint)
		print(stateToPrint.Name)
		for _, stuffs in pairs(stateToPrint.NextStates) do
			print("    - Next State Name: " .. stuffs.Name)
		end
	end
	
	for _, st in pairs(self.States) do
		printNextStates(st)
		print("    -------------    ")
	end
end

local machineMachine = {
	_machineProto = machineProto,
	_stateProto = stateProto
}

function machineMachine.NewStateMachine()
	local machineInstance = rq.DeepCopyTable(machineMachine._machineProto.new())
	machineInstance.MachineId = uuid()
	return machineInstance
end

function machineMachine.NewState( newStateName )
	local stateInstance = rq.DeepCopyTable(machineMachine._stateProto.new())
	stateInstance.Name = newStateName
	return stateInstance
end

return machineMachine