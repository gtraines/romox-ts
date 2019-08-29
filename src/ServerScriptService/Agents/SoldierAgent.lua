local ServerScriptService = game:GetService("ServerScriptService")

local agentsFolder = ServerScriptService:WaitForChild("Agents", 2)

local soldatAi = require(agentsFolder:WaitForChild("SoldierAi", 1))
local DestroyService = require(agentsFolder:WaitForChild("DestroyService", 1))

local soldierAgent = {
    SoldatBrain = nil
}

function soldierAgent.new(soldierModel)
    -- MOVE THIS TO THE MODEL SPAWN PROCESS??
    if soldierModel:FindFirstChild("Gun") == nil or 
	    soldierModel:FindFirstChild("Gun") ~= nil and not soldierModel:FindFirstChild("Gun"):IsA("Tool") then
	    soldierModel:WaitForChild("GunStorage"):WaitForChild("Gun").Parent = soldierModel
    end
    
    local soldatBrain = soldatAi.new(soldierModel)
    local function clearParts(parent)
        for _, part in pairs(parent:GetChildren()) do
            clearParts(part)
        end
        local delay
        if parent:IsA("Part") then
            delay = math.random(5,10)
        else
            delay = 11
        end
        DestroyService:AddItem(parent, delay)
    end
    
    soldierModel.Humanoid.Died:connect(function()
        soldatBrain.Stop()
        math.randomseed(tick())
        clearParts(soldierModel)
    end)

    
end

return soldierAgent


