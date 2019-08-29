local ServerScriptService = game:GetService("ServerScriptService")

local libFinder = require(ServerScriptService
	:WaitForChild("Finders")
	:WaitForChild("LibFinder"))

local rq = libFinder:FindLib("RQuery")
local pubSub = libFinder:FindLib("PubSub")
local ComponentBase = libFinder:FindLib("componentbase")

local elsFuncs = {}

function elsFuncs.GetElsModelFromVehicle(vehicleModel)
	local elsModel = vehicleModel:FindFirstChild("Body"):FindFirstChild("ELS")
	return elsModel
end
function elsFuncs.ConnectListenerFuncToElsTopic(entityId, topic, listenerFunc)
	local elsTopic = pubSub:ConnectEntityListenerFuncToTopic(entityId, "ELS", topic, listenerFunc)
	return elsTopic
end

local lightsFuncs = {
	ElsFuncs = elsFuncs
}
function lightsFuncs.GetLightGroup(lightbar, groupName)
	if lightbar ~= nil and 
		lightbar:FindFirstChild(groupName)
	then
		local lightsGroupModel = lightbar:FindFirstChild(groupName)
		return lightsGroupModel:GetChildren()
	else 
		warn(lightbar.Name .. " is nil or missing " .. groupName)
	end
end

function lightsFuncs.TurnOnLightGroup(lightgroup)
	for _, value in pairs(lightgroup) do
		lightsFuncs._turnOnLight(value)
	end
end

function lightsFuncs.TurnOffLightGroup(lightgroup)
	for _, value in pairs(lightgroup) do
		lightsFuncs._turnOffLight(value)
	end
end


function lightsFuncs._turnOnLight(lightPart)
	if lightPart:FindFirstChild("Point") ~= nil then
		lightPart.Point.Enabled = true
	end
	if lightPart:FindFirstChild("Lighto") ~= nil then
		lightPart.Lighto.Enabled = true
	end
	if lightPart.Name == "red" 
	or lightPart.Name == "white" or 
		lightPart.Name == "blue" or 
		lightPart.Name == "yellow" then
		lightPart.Material = Enum.Material.Neon
		lightPart.Transparency = 0

	end
	for idx, obj in pairs(lightPart:GetChildren()) do
		if obj:IsA("SpotLight") or obj:IsA("SurfaceLight") or obj:IsA("PointLight") then
			obj.Enabled = true
		end
	end
end

function lightsFuncs._turnOffLight(lightPart)
	if lightPart:FindFirstChild("Point") ~= nil then
		lightPart.Point.Enabled = false
	end
	if lightPart:FindFirstChild("Lighto") ~= nil then
		lightPart.Lighto.Enabled = false
	end
	if (lightPart.Name == "red" or
		lightPart.Name == "white" or 
		lightPart.Name == "blue" or 
		lightPart.Name == "yellow") and lightPart.Material == Enum.Material.Neon then
		lightPart.Material = Enum.Material.SmoothPlastic
		lightPart.Transparency = 0.6
	end
	for idx, obj in pairs(lightPart:GetChildren()) do
		if obj:IsA("SpotLight") or obj:IsA("SurfaceLight") then
			obj.Enabled = false
		end
	end
end

function lightsFuncs.TurnOffAllLights(lightbar)
	local group1 = lightsFuncs.GetLightGroup(lightbar, "G1")
	local group2 = lightsFuncs.GetLightGroup(lightbar, "G2")
	lightsFuncs.TurnOffLightGroup(group1)
	lightsFuncs.TurnOffLightGroup(group2)
end

function lightsFuncs.ConnectLights(entityId, lightsTopic, elsModel, listenerFunc)
	print("connecting lights... ")

	local elsTopicLights1 = lightsFuncs.ElsFuncs.ConnectListenerFuncToElsTopic(entityId, lightsTopic, listenerFunc)
	print(elsTopicLights1.Name .. " HAS RECEIVED A SERVER-SIDE LISTENER!@!!!!")

	return true
end

function lightsFuncs.ExecuteStrobeWigWagPattern(lightGroup1, lightGroup2)
	
	for i=1, 6 do
		wait(0.05)
		lightsFuncs.TurnOnLightGroup(lightGroup1)
		wait(0.05)
		lightsFuncs.TurnOffLightGroup(lightGroup1)
	end

	for i=1, 6 do
		wait(0.05)
		lightsFuncs.TurnOnLightGroup(lightGroup2)
		
		wait(0.05)
		lightsFuncs.TurnOffLightGroup(lightGroup2)
	end
	
end
	 
function lightsFuncs.ExecuteWigWagPattern(lightGroup1, lightGroup2)
	wait(0.2)
	lightsFuncs.TurnOnLightGroup(lightGroup1)
	lightsFuncs.TurnOffLightGroup(lightGroup2)
	wait(0.2)
	lightsFuncs.TurnOffLightGroup(lightGroup1)
	lightsFuncs.TurnOnLightGroup(lightGroup2)
end

	 
function lightsFuncs.ExecuteBlinkBlinkPattern(lightGroup1, lightGroup2)
	lightsFuncs.TurnOffLightGroup(lightGroup1)
	lightsFuncs.TurnOffLightGroup(lightGroup2)
	for i=1, 2 do
		wait(0.2)
		lightsFuncs.TurnOnLightGroup(lightGroup1)
		lightsFuncs.TurnOnLightGroup(lightGroup2)
		wait(0.2)
		lightsFuncs.TurnOffLightGroup(lightGroup1)
		lightsFuncs.TurnOffLightGroup(lightGroup2)
	end
end

local lightbar1Component = ComponentBase.new("Lightbar1", { "elshud", "lightbar1" })
lightbar1Component.LightsFuncs = lightsFuncs
function lightbar1Component._getLights1ListenerFunc(elsModel)
	
	local lightbar1 = elsModel:FindFirstChild("lightbar1")
	if lightbar1:FindFirstChild("on") == nil then
		local onValue = Instance.new("BoolValue")
		onValue.Value = false
		onValue.Name = "on"
		onValue.Parent = lightbar1
	end
	lightbar1Component.LightsFuncs.TurnOffAllLights(lightbar1)
	lightbar1.on.Value = false
	local lightsOn = false
	local listenerFunc = function(sender, data)
		print("Current LightsOn:" .. tostring(lightsOn))
		lightsOn = not lightsOn

		lightbar1.on.Value = lightsOn
		local lightGroup1 = lightbar1Component.LightsFuncs.GetLightGroup(lightbar1, "G1")
		local lightGroup2 = lightbar1Component.LightsFuncs.GetLightGroup(lightbar1, "G2")

		if lightbar1.on.Value then
			while lightbar1.on.Value do
				for iter = 1, 4 do
					if (lightbar1.on.Value) then
						lightbar1Component.LightsFuncs.ExecuteStrobeWigWagPattern(lightGroup1, lightGroup2)
					end
				end
				for iter = 1, 2 do
					if (lightbar1.on.Value) then
						lightbar1Component.LightsFuncs.ExecuteWigWagPattern(lightGroup1, lightGroup2)
					end
				end
			end
		end
		lightbar1Component.LightsFuncs.TurnOffAllLights(lightbar1)
	end

	return listenerFunc
end
function lightbar1Component:Execute(gameObject)
	local elsModel = self.LightsFuncs.ElsFuncs.GetElsModelFromVehicle(gameObject)

	self.LightsFuncs.ConnectLights(gameObject.EntityId.Value, "LIGHTS1", elsModel, self._getLights1ListenerFunc(elsModel))
end


local lightbar2Component = ComponentBase.new("Lightbar2", { "elshud", "lightbar2" })
lightbar2Component.LightsFuncs = lightsFuncs

function lightbar2Component._getLights2ListenerFunc(elsModel)
	
	local lightbar2 = elsModel:FindFirstChild("lightbar2")
	if lightbar2:FindFirstChild("on") == nil then
		local onValue = Instance.new("BoolValue")
		onValue.Value = false
		onValue.Name = "on"
		onValue.Parent = lightbar2
	end
	lightbar2Component.LightsFuncs.TurnOffAllLights(lightbar2)
	lightbar2.on.Value = false
	local lightsOn = false
	local listenerFunc = function(sender, data)
		print("Current LightsOn:" .. tostring(lightsOn))
		lightsOn = not lightsOn

		lightbar2.on.Value = lightsOn
		local lightGroup1 = lightbar2Component.LightsFuncs.GetLightGroup(lightbar2, "G1")
		local lightGroup2 = lightbar2Component.LightsFuncs.GetLightGroup(lightbar2, "G2")

		if lightbar2.on.Value then
			while lightbar2.on.Value do
				lightbar2Component.LightsFuncs.TurnOnLightGroup(lightGroup1)
				wait(0.5)
			end
		else
			lightbar2Component.LightsFuncs.TurnOffAllLights(lightbar2)
		end
	end

	return listenerFunc
end
function lightbar2Component:Execute(gameObject)
	local elsModel = self.LightsFuncs.ElsFuncs.GetElsModelFromVehicle(gameObject)

	self.LightsFuncs.ConnectLights(gameObject.EntityId.Value, "LIGHTS2", elsModel, self._getLights2ListenerFunc(elsModel))
end

local component = ComponentBase.new("ElsLights", {"elshud"})

component.InnerComponents = {
	lightbar1Component,
	lightbar2Component
}

function component:Execute(gameObject)
	for _, cmp in pairs(self.InnerComponents) do
		cmp:TryExecute(gameObject)
	end
end

return component