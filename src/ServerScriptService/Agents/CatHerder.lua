-- Orchestrate behavior of NPCs after creation
-- Connect to CollectionService, monitor NPCs added to various collections
 -- Categorize by State? (State.Name)
 -- Something else?

local module = {

}

--[[
    GameLoop
    - GameManager
    - CatHerder
      - AgentManagers
        Ex: AmbientLifeManager
        Ex: ZombieManager
          - Individual Zombie Instances
          - Manage LifeCycle
          - Spawn 
          - Try update

    - MissionManager
      - MissionTypeService
    
]]

function module:RegisterAgentManagers()
    return true

end

function module:Init()
    return true
end

function module:UpdateObserve()
    return true
end

function module:UpdateOrientation( ... )
    return true
end

function module:UpdateDecision()
    return true
end

function module:UpdateAct()
    return true
end

function module:UpdateFrame()
    return true
end

function module:TryCleanup()
    return true
end

return module