local ReplicatedStorage = game:GetService("ReplicatedStorage")

local require = require(ReplicatedStorage:WaitForChild("Nevermore", 5))
local rq = require("rquery")
local TimeManager = {}

-- Local Variables

local StartTime = 0
local Duration = 0

-- Initialization
local MapPurgeProof = rq.GetOrAddItem("MapPurgeProof", "Folder", game:GetService("Workspace"))
local Time = Instance.new('IntValue', MapPurgeProof)
Time.Name = 'Time'

-- Functions

function TimeManager:StartTimer(duration)
	StartTime = tick()
	Duration = duration
	spawn(function()
		repeat 
			Time.Value = Duration - (tick() - StartTime)
			wait()
		until Time.Value <= 0
		Time.Value = 0
	end)
end

function TimeManager:TimerDone()
	return tick() - StartTime >= Duration
end

return TimeManager
