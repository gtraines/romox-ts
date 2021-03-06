local ReplicatedStorage = game:GetService("ReplicatedStorage")
local PlayersService = game:GetService("Players")

local require = require(ReplicatedStorage:FindFirstChild("Nevermore"))
local rq = require("Std").rquery

local module = {}

-- local fireExceptToCheck = t.tuple(
-- 	t.instanceOf("Player"),
-- 	t.instanceOf("RemoteEvent")
--)

function module.FireExceptTo(player, event, ...)
	--assert(fireExceptToCheck(player, event))

	for _, other in pairs(PlayersService:GetPlayers()) do
		if other ~= player then
			event:FireClient(other, ...)
		end
	end
end
-- Create topic folder
function module.GetOrCreateClientServerTopicCategory( categoryName )
	local eventTopicFolder = ReplicatedStorage:FindFirstChild("EventTopics")
	if eventTopicFolder == nil then
		eventTopicFolder = rq.CreateFolder("EventTopics", ReplicatedStorage)
	end

	local categoryFolder = eventTopicFolder:FindFirstChild(categoryName)
	if categoryFolder == nil then
		categoryFolder = rq.CreateFolder(categoryName, eventTopicFolder)
	end

	return categoryFolder
end

-- Create ClientServer topic in folder
function module.GetOrCreateClientServerTopicInCategory(categoryName, topicName)
	local categoryFolder = module.GetOrCreateClientServerTopicCategory(categoryName)

	local topic = categoryFolder:FindFirstChild(topicName)
	if topic == nil or not topic:IsA("RemoteEvent") then
		topic = Instance.new("RemoteEvent")
		topic.Name = topicName
		topic.Parent = categoryFolder
	end
	return topic
end

-- Subscribe Server to event topic
-- callback params:
--  callback(playerWhoFiredTheEvent, argumentsTuplePassedByFireServer)
-- Receives events generated by RemoteEvent:FireServer()
function module.SubscribeServerToTopicEvent(categoryName, topicName, serverCallback)
	print("Subscribing to event " .. topicName .. " in " .. categoryName)
	local topic = module.GetOrCreateClientServerTopicInCategory(categoryName, topicName)
	topic.OnServerEvent:Connect(serverCallback)
	return topic
end

function module.ConnectEntityListenerFuncToTopic(entityId, categoryName, topic, listenerFunc)
	local gatekeeperClosure = function(listeningEntityId, wrappedListenerFunc)
		local wrapperFunc = function(sender, receiverEntityId)
			if (receiverEntityId ~= nil and receiverEntityId == listeningEntityId) then
				wrappedListenerFunc(sender, receiverEntityId)
			end
		end
		return wrapperFunc
	end

	local subscribedTopic = module.SubscribeServerToTopicEvent(categoryName, 
		topic,
		gatekeeperClosure(entityId, listenerFunc))
	return subscribedTopic
end

return module
