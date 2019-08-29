
local ServerScriptService = game:GetService("ServerScriptService")
local libFinder = require(ServerScriptService
	:WaitForChild("Finders", 2)
	:WaitForChild("LibFinder"))

local rq = libFinder:FindLib("rquery")
local perception = libFinder:FindLib("perception")

local StateMachineMachine = libFinder:FindLib("stateMachineMachine")
local agentsFolder = ServerScriptService:WaitForChild("Agents", 2)

local aiBase = require(agentsFolder:WaitForChild("PathfindingAiBase", 2))
local HumanoidList = require(agentsFolder:WaitForChild("HumanoidFinder", 2))

local soldatAiProto = {
	_configs = {},
	CurrentTarget = nil,
	SoldatModel = nil,
	SoldatTorso = nil
}

local soldatBrainMeta = { __index = soldatAiProto }

function soldatAiProto:PushStates()

	local IdleState = self:GetIdleState()

	local defaultFaceCFrame = self.SoldatTorso.CFrame
	local desiredFaceAngle = 0
	local lastTurned = 0
	local turningGyro = self.SoldatTorso.BodyGyro
	local turnWait = math.random(5,10)

	self.CurrentTarget = game.Workspace:FindFirstChild("Zombie") -- ***<--- FIX THIS TO BE DYNAMIC

	local IdleState = self:GetIdleState()
	IdleState.Action = function()
		local now = os.time()
		if now - lastTurned > turnWait then
			desiredFaceAngle = math.random(-60, 60)
			lastTurned = now
			turnWait = math.random(5,10)
		end
		local currentFaceDirection = self.SoldatTorso.CFrame.lookVector
		local angle = math.acos(currentFaceDirection:Dot(defaultFaceCFrame.lookVector))
		turningGyro.cframe = defaultFaceCFrame * CFrame.fromEulerAnglesXYZ(0, math.rad(desiredFaceAngle),0)
	end
	IdleState.Init = function()
		turningGyro.maxTorque = Vector3.new(0, 10000, 0)
	end
	
	local lastAttack = 0
	local AttackState = self.StateMachine.NewState("Attack")
	local AimTrack = self.SoldatModel.Humanoid:LoadAnimation(self.SoldatModel.Animations.Aim)
	local aiming = false
	AttackState.Action = function()
		if self.CurrentTarget then
			-- go into aiming animation
			if not aiming then
				aiming = true
				AimTrack:Play()	
			end
			
			-- face the target
			local currentTargetTorso = rq.PersonageTorsoOrEquivalent(self.CurrentTarget)
			self.SoldatModel:SetPrimaryPartCFrame(CFrame.new(
				self.SoldatTorso.Position,
				Vector3.new(currentTargetTorso.Position.X, 
					self.SoldatTorso.Position.Y, 
					currentTargetTorso.Position.Z))*CFrame.Angles(0,-math.pi/3,0))

			local now = os.time()
			if now - lastAttack > self:GetConfigValue("AttackCooldown") then
				lastAttack = now
				
				-- render shot
				local toTarget = currentTargetTorso.Position - self.SoldatTorso.Position
				local hit = -toTarget.magnitude/self:GetConfigValue("AggroRange") + 1
				if math.random() < hit then
					self.CurrentTarget.Humanoid.Health = 
						self.CurrentTarget.Humanoid.Health - self:GetConfigValue("Damage")
				else
					-- missed!
					local hOffset = toTarget:Cross(Vector3.new(0,1,0)).unit * 5 * math.random(-1, 1)
					toTarget = toTarget + hOffset
					local missRay = Ray.new(self.SoldatTorso.Position, toTarget.unit * 1000)
					local ignoreList = {}
					table.insert(ignoreList, self.SoldatModel)
					local part, position = game.Workspace:FindPartOnRayWithIgnoreList(missRay, ignoreList)
					if part then
						if part and part.Parent and part.Parent:FindFirstChild("Humanoid") and 
								part.Parent ~= "Soldier" then
							if game.Players:GetPlayerFromCharacter(part.Parent) and not self:GetConfigValue("CanDamagePlayer") then 
								return
							end
							local otherHumanoid = part.Parent:FindFirstChild("Humanoid")
							otherHumanoid.Health = otherHumanoid.Health - self:GetConfigValue("Damage")
						end
					end
				end	
				
				local shot = Instance.new("Part", game.Workspace)
				shot.FormFactor = Enum.FormFactor.Custom
				shot.Size = Vector3.new(.1,.1,toTarget.magnitude)
				shot.Anchored = true
				shot.CanCollide = false
				--shot.Position = soldier.Torso.Position + toTarget / 2
				shot.CFrame = CFrame.new(self.SoldatTorso.Position + toTarget / 2, self.SoldatTorso.Position)
				shot.BrickColor = BrickColor.Yellow()
				game.Debris:AddItem(shot, .1)
			end
		end
	end
	AttackState.Init = function()
		turningGyro.maxTorque = Vector3.new(0, 0, 0)
	end
	
	-- CONDITIONS	
	local CanSeeTarget = self.StateMachine.NewCondition()
	CanSeeTarget.Name = "CanSeeTarget"
	CanSeeTarget.Evaluate = function()
		local humanoids = HumanoidList:GetCurrent()
		local soldiers = {}
		local enemies = {}
		for _, object in pairs(humanoids) do
			if object 
				and object.Parent 
				and not game.Players:GetPlayerFromCharacter(object.Parent) and object.Health > 0
					and object.WalkSpeed > 0 and object.Parent:FindFirstChild("Torso") then
				local torso = rq.PersonageTorsoOrEquivalent(object.Parent)
				local distance = (self.SoldatTorso.Position - torso.Position).magnitude
				if distance <= self.GetConfigValue("AggroRange") then
					if object.Parent.Name == "Soldier" then
						table.insert(soldiers, object.Parent)
					else
						table.insert(enemies, object.Parent)
					end
				end			
			end
		end
		
		local target = perception:GetClosestVisibleTarget(
			self.SoldatModel, enemies, soldiers, self:GetConfigValue("FieldOfView"))
		if target then
			self.CurrentTarget = target
			return true
		end
		return false
	end
	CanSeeTarget.TransitionState = AttackState
	
	local TargetDead = self.StateMachine.NewCondition()
	TargetDead.Name = "TargetDead"
	TargetDead.Evaluate = function()
		if self.CurrentTarget and self.CurrentTarget:FindFirstChild("Humanoid") then
			return self.CurrentTarget.Humanoid.Health <= 0
		end
		return true
	end
	TargetDead.TransitionState = IdleState	
	
	
	table.insert(IdleState.Conditions, CanSeeTarget)
	table.insert(AttackState.Conditions, TargetDead)	
	
	self.StateMachine.SwitchState(IdleState)
	
	self.Stop = function()
		self.StateMachine.SwitchState(nil)
	end
	
end

function soldatAiProto:LoadConfigsFromModel(soldatModel)
	local configTable = soldatModel:FindFirstChild("Configurations")
	self:LoadConfig(configTable, "AggroRange", 100)
	self:LoadConfig(configTable, "FieldOfView", 180)
	self:LoadConfig(configTable, "Damage", 50)
	self:LoadConfig(configTable, "AttackCooldown", 1)
	self:LoadConfig(configTable, "CanDamagePlayer", false)
end

-- ***************************************
-- ***************************************
-- {48bfcbf7-e9c5-488b-96ab-9158850d2055}
-- Create metatable for this
-- ***************************************
-- ***************************************
function soldatAiProto:Init(soldatModel)
	self:LoadConfigsFromModel(soldatModel)
	self.SoldatModel = soldatModel
	self.SoldatTorso = rq.PersonageTorsoOrEquivalent(self.SoldatModel)
	self.StateMachine = StateMachineMachine.NewStateMachine()
	self:PushStates()
end


local soldatAiModule = {}

function soldatAiModule.new(soldatModel, targetNames)
	local aiInstanceMeta = setmetatable({}, soldatBrainMeta)
	local aiInstance = setmetatable(aiInstanceMeta, aiBase.new())

	aiInstance:Init(soldatModel)

	return aiInstance
end

return soldatAiModule