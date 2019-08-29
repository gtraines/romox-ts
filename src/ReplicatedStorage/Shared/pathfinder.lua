local ReplicatedStorage = game:GetService("ReplicatedStorage")
local rq = require(ReplicatedStorage
	:WaitForChild("Shared"):WaitForChild("rquery"))
local PathfindingService = game:GetService("PathfindingService")
PathfindingService.EmptyCutoff = .3

local pathProgressProto = {
	CurrentTargetPos = nil,
	LastTargetPos = nil,
	Waypoints = {},
	Path = nil,
	CurrentWaypointIndex = 1,
	PathBlockedEventConnection = nil,
	WaypointReachedEventConnection = nil,
	PathCalculationAttempts = 0,
	MAX_PATH_CALCULATION_ATTEMPTS = 20
}

local pathProgressMeta = { __index = pathProgressProto }

local module = {
	DefaultPersonageMovementParams = {
		TargetOffsetMax = 10, --5
		JumpThreshold = 1.5, --2.5
		NextPointThreshold = 4,
	},
	DefaultPathParams = {
		AgentRadius = 2,
		AgentHeight = 5
	}
}

function module.GetPathForPersonage(
	personage,
	destinationObject,
	pathParams)

	if pathParams == nil then 
		 pathParams = module.DefaultPathParams
	end
	
	local pathProgressData = setmetatable({}, pathProgressMeta)

	pathProgressData.Path = PathfindingService:CreatePath(pathParams)
	
	local personageRootPart = personage:FindFirstChild("HumanoidRootPart")
	if personageRootPart == nil then
		personageRootPart = personage.PrimaryPart or personage.FindFirstChild("Torso")
	end
	-- Compute and check the path
	pathProgressData.Path:ComputeAsync(personageRootPart.Position, destinationObject.Position)
	pathProgressData.PathCalculationAttempts = pathProgressData.PathCalculationAttempts + 1
	
	if pathProgressData.Path.Status == Enum.PathStatus.Success then
		return pathProgressData
	else
		warn("Unable to find path for " .. personage.Name .. " to " .. destinationObject.Name)
		local humanoid = personage:FindFirstChild("Humanoid")
		humanoid:MoveTo(personageRootPart.Position)
		return nil

	end
end

function module.ClearPathWaypointMarkers(  )
	local pointsFolder = rq.GetOrAddItem( "Points", "Folder", game.Workspace )
	pointsFolder:ClearAllChildren()
end

function module.DisplayPathWaypoints(pathProgressData)
	local pointsFolder = rq.GetOrAddItem( "Points", "Folder", game.Workspace )
	local waypoints = pathProgressData.Path:GetWaypoints()

	-- Loop through waypoints
	for _, waypoint in pairs(waypoints) do
		local part = Instance.new("Part")
		part.Shape = "Ball"
		part.Material = "Neon"
		part.Size = Vector3.new(0.6, 0.6, 0.6)
		part.Position = waypoint.Position
		part.Anchored = true
		part.CanCollide = false
		part.Parent = pointsFolder
	end
end

function module.MovePersonageOnPath(personage,
	pathProgressData,
	onWaypointReachedDelegate,
	personageMovementParams)

	if pathProgressData == nil or pathProgressData.Path.Status ~= Enum.PathStatus.Success then
		error("PATH NOT FOUND!!!")
	end
	
	if personageMovementParams == nil then
		personageMovementParams = rq.DeepCopyTable(module.DefaultPersonageMovementParams)
	end

 	local humanoid = personage:FindFirstChild("Humanoid")
	
	pathProgressData.Waypoints = pathProgressData.Path:GetWaypoints()
	local personageTorso = rq.PersonageTorsoOrEquivalent(personage)
	
	if pathProgressData.CurrentWaypointIndex < #pathProgressData.Waypoints then
		local currentPoint = pathProgressData.Waypoints[pathProgressData.CurrentWaypointIndex]
		local distance = (personageTorso.Position - currentPoint.Position).magnitude
		if distance < personageMovementParams.NextPointThreshold then
			pathProgressData.CurrentWaypointIndex = pathProgressData.CurrentWaypointIndex + 1
		end

		humanoid:MoveTo(pathProgressData.Waypoints[pathProgressData.CurrentWaypointIndex].Position)
		if pathProgressData.Waypoints[pathProgressData.CurrentWaypointIndex].Position.Y - 
			personageTorso.Position.Y > personageMovementParams.JumpThreshold then
			humanoid.Jump = true
		end
	end
	humanoid:MoveTo(
			pathProgressData.Waypoints[pathProgressData.CurrentWaypointIndex].Position)

	pathProgressData.WaypointReachedEventConnection = humanoid.MoveToFinished:Connect(
		onWaypointReachedDelegate
	)
	return pathProgressData
end

return module