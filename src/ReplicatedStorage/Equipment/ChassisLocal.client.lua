wait(0.1)

local RunService = game:GetService("RunService")
local Model = script:WaitForChild("Object", 3).Value
local Stats = Model:WaitForChild("Stats")
local Constraints = Model:WaitForChild("Constraints")
local VehicleSeat = Model:WaitForChild("VehicleSeat")
local Player = game.Players.LocalPlayer
local Character = workspace:WaitForChild(Player.Name)
local Humanoid = Character:WaitForChild("Humanoid")
local ControlModule = require(Player:WaitForChild "PlayerScripts" :WaitForChild "PlayerModule" :WaitForChild "ControlModule" )

RunService.RenderStepped:Connect(function()
	if Humanoid.SeatPart == VehicleSeat and Humanoid.Health > 0 then
	   local MoveVector = ControlModule:GetMoveVector()
	   for i , v in next, Constraints:GetChildren() do
		   if v:IsA("HingeConstraint") then
			  v.TargetAngle = Stats.TurnRadius.Value * -MoveVector.X
			  v.AngularVelocity =(Stats.MaxSpeed.Value / 3.14159) * MoveVector.Z
		   end
	   end
	else
		script:Destroy()
	end
end)



