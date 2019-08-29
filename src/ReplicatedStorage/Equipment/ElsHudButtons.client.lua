wait(0.1)

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local scriptFinder = require(ReplicatedStorage
	:FindFirstChild("Scripts")
	:FindFirstChild("ScriptFinder"))

local pubSubClient = scriptFinder:FindLib("pubsubclient")
local RunService = game:GetService("RunService")
local Player = game.Players.LocalPlayer
local Character = workspace:WaitForChild(Player.Name)
local Model = script.Parent.Vehicle.Value

local VehicleSeat = Model:WaitForChild("VehicleSeat")
local Humanoid = Character:WaitForChild("Humanoid")

local entityId = ""

if Model:FindFirstChild("EntityId") then
    entityId = Model:FindFirstChild("EntityId").Value
else
	error("Missing unique identifier EntityId on model: " .. Model.Name)
end

local function generateDelegate(entityId, button)
    local topic = pubSubClient.GetOrCreateClientServerTopicInCategory("ELS", button.Text)
    print(topic.Name)
	local activatedDelegate = function(sender)
        topic:FireServer(entityId)
		print("Received click from entity: " .. entityId .. " on button: " .. button.Text)
	end
	return activatedDelegate
end

local buttons = script.Parent:FindFirstChild("HudFrame"):GetChildren()

local function connectButton(entityId, button)
    if button:IsA("GuiButton") then
		button.Activated:Connect(generateDelegate(entityId, button))
		print("Added delegate handler to button: " .. button.Name)
    end
end

for _, btn in pairs(buttons) do
    print("Connecting button: " .. btn.Name)
    connectButton(entityId, btn)
end

RunService.RenderStepped:Connect(function()
	if Humanoid.SeatPart ~= VehicleSeat or Humanoid.Health <= 0 then
		script.Parent.Parent = nil
		script:Destroy()
	end
end)