local RunService = game:GetService('RunService')

-- Local Variables
local Tool = script.Parent
local Buffer = {}
local Configurations = Tool:WaitForChild('Configuration')
local Storage = Configurations:WaitForChild('StorageFolder').Value
local Player = game.Players.LocalPlayer
local RocketManager = require(script:WaitForChild('RocketManager'))
local Handle = Tool.Handle
local Neck, Shoulder, OldNeckC0, OldShoulderC0
local OldMouseIcon
local Mouse = Player:GetMouse()
local AutoRotate = false
local CanFire = true

-- Initialization
for _, child in ipairs(Storage:GetChildren()) do
	table.insert(Buffer, child)
end

-- Local Functions
local function OnActivation()
	if Player.Character.Humanoid:GetState() == Enum.HumanoidStateType.Swimming then return end
	if CanFire then
		CanFire = false
		
		local rocket = table.remove(Buffer, 1)
		rocket.Rocket.Transparency = 0
		Tool.FireRocket:FireServer(rocket)		
		
		local toMouse = (Mouse.Hit.p - Handle.Position).unit
		local direction = toMouse * 5
		
		rocket.PrimaryPart.CFrame = CFrame.new(Handle.Position, Handle.Position + direction) + direction
		rocket.PrimaryPart.Velocity = direction * 40
		RocketManager:BindRocketEvents(rocket)
		
		wait(Configurations.ReloadTimeSeconds.Value)
		CanFire = true	
	end
end

local function OnStorageAdded(child)
	table.insert(Buffer, child)
end

local function SetupJoints()
	if Player.Character.Humanoid.RigType == Enum.HumanoidRigType.R15 then
		return -- TODO: Make tracking compatible with R15
	end
	local torso = Player.Character:FindFirstChild("Torso")
	
	Neck = torso.Neck
	OldNeckC0 = Neck.C0
	Shoulder = torso['Right Shoulder']
	OldShoulderC0 = Shoulder.C0
end

local function Frame(mousePosition)
	if Player.Character.Humanoid:GetState() == Enum.HumanoidStateType.Swimming then return end
	local torso = Player.Character.HumanoidRootPart
	local head = Player.Character.Head
	
	local toMouse = (mousePosition - head.Position).unit
	local angle = math.acos(toMouse:Dot(Vector3.new(0,1,0)))
	
	local neckAngle = angle
	
	-- Limit how much the head can tilt down. Too far and the head looks unnatural
	if math.deg(neckAngle) > 110 then
		neckAngle = math.rad(110)
	end
	Neck.C0 = CFrame.new(0,1,0) * CFrame.Angles(math.pi - neckAngle,math.pi,0)
	
	-- Calculate horizontal rotation
	local arm = Player.Character['Right Arm']
	local fromArmPos = torso.Position + torso.CFrame:vectorToWorldSpace(Vector3.new(
		torso.Size.X/2 + arm.Size.X/2, torso.Size.Y/2 - arm.Size.Z/2, 0))
	local toMouseArm = ((mousePosition - fromArmPos) * Vector3.new(1,0,1)).unit
	local look = (torso.CFrame.lookVector * Vector3.new(1,0,1)).unit
	local lateralAngle = math.acos(toMouseArm:Dot(look))
	
	-- Check for rogue math
	if tostring(lateralAngle) == "-1.#IND" then
		lateralAngle = 0
	end		
	
	-- Handle case where character is sitting down
	if Player.Character.Humanoid:GetState() == Enum.HumanoidStateType.Seated then			
		local cross = torso.CFrame.lookVector:Cross(toMouseArm)
		if lateralAngle > math.pi/2 then
			lateralAngle = math.pi/2
		end
		if cross.Y < 0 then
			lateralAngle = -lateralAngle
		end
	end	
	
	-- Turn shoulder to point to mouse
	Shoulder.C0 = CFrame.new(1,0.5,0) * CFrame.Angles(math.pi/2 - angle,math.pi/2 + lateralAngle,0)	
	
	-- If not sitting then aim torso laterally towards mouse
	if Player.Character.Humanoid:GetState() ~= Enum.HumanoidStateType.Seated then
		torso.CFrame = CFrame.new(torso.Position, torso.Position + (Vector3.new(
			mousePosition.X, torso.Position.Y, mousePosition.Z)-torso.Position).unit)
	end	
end

local function MouseFrame()
	Frame(Mouse.Hit.p)
end

local function OnEquip()
	-- Setup joint variables
	SetupJoints()
	
	-- Replace mouse icon and store old
	OldMouseIcon = Mouse.Icon
	Mouse.Icon = 'rbxassetid://79658449'
	
	Mouse.TargetFilter = Player.Character
	
	if Player.Character.Humanoid.RigType == Enum.HumanoidRigType.R6 then
		AutoRotate = Player.Character.Humanoid.AutoRotate
		Player.Character.Humanoid.AutoRotate = false
	
		RunService:BindToRenderStep('RotateCharacter', Enum.RenderPriority.Input.Value, MouseFrame)
	end
end

local function OnUnequip()
	Mouse.Icon = OldMouseIcon
	
	if Player.Character.Humanoid.RigType == Enum.HumanoidRigType.R6 then
		Neck.C0 = OldNeckC0
		Shoulder.C0 = OldShoulderC0
		
		Player.Character.Humanoid.AutoRotate = AutoRotate
		RunService:UnbindFromRenderStep('RotateCharacter')
	end
end

-- Event Binding
Tool.Activated:connect(OnActivation)
Storage.ChildAdded:connect(OnStorageAdded)
Tool.Equipped:connect(OnEquip)
Tool.Unequipped:connect(OnUnequip)