local ServerScriptService = game:GetService("ServerScriptService")
local LibFinder = require(ServerScriptService:WaitForChild("Finders",2):WaitForChild("LibFinder",2))

local rq = LibFinder:FindLib("rquery")
local pathfinder = LibFinder:FindLib("pathfinder")
local StateMachineMachine = LibFinder:FindLib("stateMachineMachine")

local pathfindingAiProto = {
	_configs = {},
	StateMachine = nil,
	MAX_FORCE =  75,
	Personage = nil
}

local pathfindingAiMeta = { __index = pathfindingAiProto }

function pathfindingAiProto:GetOnWaypointReachedDelegate(pathProgressData)
	local delegateHandler = function(reached)
		
		local currentWaypointIndex = pathProgressData.CurrentWaypointIndex
		local waypoints = pathProgressData.Waypoints
		if waypoints ~= nil then

			local movingTo = waypoints[currentWaypointIndex]

			if movingTo ~= nil then
				if movingTo["Position"] ~= nil then
					--print("MOVING TO " .. tostring(waypoints[movingTo].Position))		
					if reached and currentWaypointIndex < #waypoints then
						
						pathProgressData.CurrentWaypointIndex = currentWaypointIndex + 1
						self.Personage:FindFirstChild("Humanoid"):MoveTo(
							movingTo.Position)
					end
				end
			end
		end
	end
	return delegateHandler
end

function pathfindingAiProto:GetOnPathBlockedDelegate(pathProgressData, destinationPart, displayWaypointMarkers)
	local delegateHandler = function (blockedWaypointIndex)
		if blockedWaypointIndex > pathProgressData.CurrentWaypointIndex then
			pathProgressData.PathBlockedEventConnection:Disconnect()
			pathProgressData.Path:destroy()
			wait(0.5)
			self:MoveTo( destinationPart, displayWaypointMarkers )
		end
	end

	return delegateHandler
end

function pathfindingAiProto:MoveTo( destinationPart, displayWaypointMarkers )
	local pathProgressData = pathfinder.GetPathForPersonage(
		self.Personage, destinationPart)
	local pathBlockedEventConnection = pathProgressData.Path.Blocked:Connect(
			self:GetOnPathBlockedDelegate(
				pathProgressData,
				destinationPart, 
				displayWaypointMarkers)
			)
	pathProgressData.PathBlockedEventConnection = pathBlockedEventConnection

	if pathProgressData ~= nil then
		if displayWaypointMarkers then
			pathfinder.DisplayPathWaypoints(pathProgressData)
		end
		pathProgressData = pathfinder.MovePersonageOnPath(self.Personage,
			pathProgressData,
			self:GetOnWaypointReachedDelegate(pathProgressData))
	end
	return pathProgressData
end

function pathfindingAiProto:GetRepulsionVector(unitPosition, otherUnitsPositions, maxForce)
    if maxForce == nil or maxForce == 0 then
		maxForce = self.MAX_FORCE
    end

    local repulsionVector = Vector3.new(0,0,0)
	local count = 0
	for _, other in pairs(otherUnitsPositions) do
		local fromOther = unitPosition - other 
		--fromOther = fromOther.unit * ((-maxForce / 5) * math.pow(fromOther.magnitude,2) + maxForce)
		fromOther = fromOther.unit * 1000 / math.pow((fromOther.magnitude + 1), 2)
		repulsionVector = repulsionVector + fromOther
	end
	return repulsionVector * maxForce
end


function pathfindingAiProto:GetNewState(stateName)
	return self.StateMachine.NewState(stateName)
end

function pathfindingAiProto:GetIdleState()
	local idleState = self.StateMachine.NewState("Idle")
	idleState.Action = function() end
	idleState.Init = function() end
	return idleState
end

function pathfindingAiProto:LoadConfig(configSource, configName, defaultValue)
	if configSource:FindFirstChild(configName) then
		self._configs[configName] = configSource:FindFirstChild(configName).Value
	else
		self._configs[configName] = defaultValue
	end
end

function pathfindingAiProto:GetConfigValue(configName)
	if self._configs[configName] ~= nil then
		return self._configs[configName]
	else
		warn("No config found for key: " ..  configName)
		return nil
	end
end

local aiBaseModule = {}

function aiBaseModule.new(personage)
	local npcAiInstance = setmetatable({}, pathfindingAiMeta)
	npcAiInstance.StateMachine = StateMachineMachine.NewStateMachine()
	npcAiInstance.Personage = personage
    return npcAiInstance
end

return aiBaseModule