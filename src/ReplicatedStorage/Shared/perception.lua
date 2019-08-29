local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local rq = require(ReplicatedStorage
	:WaitForChild("Shared", 1)
	:WaitForChild("rquery", 1))

local module = {}

function module.Raycast(ray, blacklist, partToCheck)
	blacklist = blacklist or {}
	local results = {}
	
	while true do
		results = {Workspace:FindPartOnRayWithIgnoreList(ray, blacklist)}
		
		local hit = results[1]
		
		if not hit then
			break
		else
			local canCollideWith = partToCheck and partToCheck:CanCollideWith(hit) or hit.CanCollide
			
			if canCollideWith then
				break
			else
				table.insert(blacklist, hit)
			end
		end
	end
	
	return unpack(results)
end

--Checks if given a range, if origin has line of sight with character.
function module.GetIsInLiveOfSight(origin, character, range, blacklist)
	if typeof(origin) == "Instance" then
		origin = origin.Position
	end
	
	local hit, point = module.Raycast(Ray.new(origin, (origin - character.HumanoidRootPart.Position).Unit * -range), blacklist)
	
	return hit and hit:IsDescendantOf(character), point
end

function module.IsSpaceEmpty(position)
	local region = Region3.new(position - Vector3.new(2,2,2), position + Vector3.new(2,2,2))
	return Workspace:IsRegion3Empty(region)
end

function module:GetRandomXZOffsetNear(targetVector3)
	local xOffset = math.random(5,10)
	if math.random() > .5 then
		xOffset = xOffset * -1
	end
	local zOffset = math.random(5, 10)
	if math.random() > .5 then
		zOffset = zOffset * -1
	end

	local targetPos = Vector3.new(targetVector3.X + xOffset,
		targetVector3.Y,
		targetVector3.Z + zOffset)

	return targetPos
end

function module.FindEmptySpaceCloseTo(targetVector3)

	if targetVector3 == nil or not targetVector3:IsA("Vector3") then
		error("Missing target vector")
		return nil
	end

	local targetPos = Vector3.new(0,0,0)
	local count = 0
	math.randomseed(os.time())
	repeat

		targetPos = module.GetRandomXZOffsetNear(targetVector3)
		if module.IsSpaceEmpty(targetPos) then
			return targetPos
		else
			targetPos = targetPos + Vector3.new(0,4,0)
		end
		
		if module.IsSpaceEmpty(targetPos) then
			return targetPos
		end
		count = count + 1
	until count > 10
	return nil
end

function module.WideRayCast(start, target, offset, ignoreList)
	local parts = {}
	
	local ray = Ray.new(start, target - start)
	local part, point = Workspace:FindPartOnRayWithIgnoreList(ray, ignoreList)
	if part then table.insert(parts, part) end
	
	local offsetVector = offset * (target - start):Cross(Vector3.FromNormalId(Enum.NormalId.Top)).unit
	local ray = Ray.new(start + offsetVector, target - start + offsetVector)
	local part, point = Workspace:FindPartOnRayWithIgnoreList(ray, ignoreList)
	if part then table.insert(parts, part) end
	
	local ray = Ray.new(start - offsetVector, target - start - offsetVector)
	local part, point = Workspace:FindPartOnRayWithIgnoreList(ray, ignoreList)
	if part then table.insert(parts, part) end
	
	return parts
end

function module.FindNearestPathPoint(path, point, start, target, ignoreList)
	local occludePoint = path:CheckOcclusionAsync(point)
	if occludePoint > 0 then
		module.WideRayCast(start)
	end
end

function module.ShootAzimuth(fromPosition, fromLookVector, toPosition)
	local toTarget = toPosition - fromPosition
	local toTargetWedge = toTarget * Vector3.new(1,0,1)

	local angleRads = math.acos(toTargetWedge:Dot(fromLookVector)/toTargetWedge.magnitude)
	return {
		ToTargetOffsets = toTarget,
		AzimuthDegrees = math.deg(angleRads)
	}
end

function module.CanHunterSeeTarget(hunterTorso, hunterFieldOfViewDegrees, targetTorso, ignoreList)
	local azimuthToTarget = module.ShootAzimuth(hunterTorso.Position, 
		hunterTorso.CFrame.lookVector, 
		targetTorso.Position)

	if azimuthToTarget.AzimuthDegrees < hunterFieldOfViewDegrees then
		local targetRay = Ray.new(hunterTorso.Position, azimuthToTarget.ToTargetOffsets)
		local part, position = Workspace:FindPartOnRayWithIgnoreList(targetRay, ignoreList)
		if part and part.Parent == targetTorso then
			return true
		end
	end
	return false
end

function module.GetClosestVisibleTarget(hunterPersonage, candidateTargets, ignoreList, fieldOfView)
	local closestTarget = nil
	local closestDistance = math.huge
	local hunterTorso = rq.PersonageTorsoOrEquivalent(hunterPersonage)
	for _, candidateTarget in pairs(candidateTargets) do
		local targetTorso = rq.PersonageTorsoOrEquivalent(candidateTarget)
		
		if module.CanHunterSeeTarget(hunterTorso, fieldOfView, targetTorso, ignoreList) then 
			local toTargetOffsets = hunterTorso.Position - targetTorso.Position
			if toTargetOffsets.magnitude < closestDistance then
				closestTarget = targetTorso
				closestDistance = toTargetOffsets.magnitude
			end
		end

	end
	return closestTarget
end
return module