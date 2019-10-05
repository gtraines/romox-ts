bin = script.Parent

function move(target)
	local dir = (target.Position - bin.Position).unit
	local spawnPos = bin.Position
	local pos = spawnPos + (dir * 1)
	bin:findFirstChild("BodyGyro").cframe = CFrame.new(pos,  pos + dir)
	bin:findFirstChild("BodyGyro").maxTorque = Vector3.new(9000,9000,9000)
end

function moveTo(target)
	bin.BodyPosition.position = target.Position
	bin.BodyPosition.maxForce = Vector3.new(10000,10000,10000) * bin.Speed.Value
end

function findNearestTorso(pos)
	local list = game.Workspace:GetChildren() -- WRONG!!!!
	local torso = nil
	local dist = 1000
	local temp = nil
	local human = nil
	local temp2 = nil
	for x = 1, #list do
		temp2 = list[x]
		if (temp2.className == "Model") and (temp2 ~= script.Parent) then
			temp = temp2:findFirstChild("Torso")
			human = temp2:findFirstChild("Humanoid")
			if (temp ~= nil) and (human ~= nil) and (human.Health > 0) then
				if (temp.Position - pos).magnitude < dist then
					torso = temp
					dist = (temp.Position - pos).magnitude
				end
			end
		end
	end
	return torso
end

function shoot(pos)
	dir = (pos - bin.CFrame.p).unit 
	for i = 1, 50 do 
		local ex = Instance.new("Explosion") 
		ex.BlastRadius = 1
		ex.Position = bin.Position + (dir * 10 * i) + (dir * 7) 
		ex.Parent = game.Workspace 
	end
end

function shootAt(torso)
	local dir = (torso.Position - bin.Position).unit
	local spawnPos = bin.Position
	local pos = spawnPos + (dir * 1)
	shoot(pos)
end

while true do
	local torso = findNearestTorso(bin.Position)
	if torso~=nil then
		move(torso)
		moveTo(torso)
	end
	wait()
end
