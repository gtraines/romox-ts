local ServerScriptService = game:GetService("ServerScriptService")

local libFinder = require(game
	:GetService("ServerScriptService")
	:WaitForChild("Finders")
	:WaitForChild("LibFinder"))

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

local sirenFuncs = {
    ElsFuncs = elsFuncs
}

function sirenFuncs.__turnOffAllSirens(sirenPart)
	if sirenPart ~= nil and sirenPart:GetChildren() ~= nil then
		for _, siren in pairs(sirenPart:GetChildren()) do
			if siren:FindFirstChild("Stop") ~= nil then
				print("Stopping " .. siren)
				siren:Stop()
			end
		end
	end
end

function sirenFuncs.__stopSiren(sirenPart, sirenName)
	if sirenPart ~= nil and sirenPart:FindFirstChild(sirenName) ~= nil then
		local sirenSound = sirenPart:FindFirstChild(sirenName)
		sirenSound:Stop()
	end
end

function sirenFuncs.__playSiren(sirenPart, sirenName)
	
	if sirenPart ~= nil and sirenPart:FindFirstChild(sirenName) ~= nil then
		local sirenSound = sirenPart:FindFirstChild(sirenName)
		sirenSound:Play()
		sirenSound.Volume = 0.5
		sirenSound.Looped = true
	end
end

function sirenFuncs._getSiren1ListenerFunc(elsModel)
	
	local sirenPart = elsModel:FindFirstChild("Siren")
	local sirenSound = sirenPart:FindFirstChild("Wail")
	sirenSound.EmitterSize = 10
	local siren1On = false

	local listenerFunc = function(sender, data)
		sirenFuncs.__turnOffAllSirens(sirenPart)

		siren1On = not siren1On

		if siren1On == true then
			sirenFuncs.__playSiren(sirenPart, "Wail")
		else 
			sirenFuncs.__stopSiren(sirenPart, "Wail")
		end
	end
	return listenerFunc
end

function sirenFuncs._getSiren2ListenerFunc(elsModel)
	
	local sirenPart = elsModel:FindFirstChild("Siren")
	local sirenSound = sirenPart:FindFirstChild("Yelp")
	sirenSound.EmitterSize = 10
	local siren2On = false
	local listenerFunc = function(sender, data)
		sirenFuncs.__turnOffAllSirens(sirenPart)

		siren2On = not siren2On

		if siren2On == true then
			sirenFuncs.__playSiren(sirenPart, "Yelp")
		else 
			sirenFuncs.__stopSiren(sirenPart, "Yelp")
		end
	end
	return listenerFunc
end

local component = ComponentBase.new("ElsHud", {"elshud"})
component.SirenFuncs = sirenFuncs

function component:Execute( gameObject )
    local elsModel = self.SirenFuncs.ElsFuncs.GetElsModelFromVehicle(gameObject)

    self.SirenFuncs.ElsFuncs.ConnectListenerFuncToElsTopic(gameObject.EntityId.Value, "SIREN1",  self.SirenFuncs._getSiren1ListenerFunc(elsModel))
    self.SirenFuncs.ElsFuncs.ConnectListenerFuncToElsTopic(gameObject.EntityId.Value, "SIREN2",  self.SirenFuncs._getSiren2ListenerFunc(elsModel))
end

return component