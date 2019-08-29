local ReplicatedStorage = game:GetService("ReplicatedStorage")

local rq = require(ReplicatedStorage:FindFirstChild("Shared"):FindFirstChild("rquery"))
local std = require(ReplicatedStorage:WaitForChild("Std").Namespace)

local component = {
    __type = "component"
}

local mt = { __index = component }

function component:Execute(gameObject) 
    error(self.Name .. ": Execute: NO RUBER")
    return nil
end

function component:TryExecute(gameObject)
    local components = rq.ComponentsFolderOrNil(gameObject)
    
    if components ~= nil and #components > 0 then
        for _, value in pairs(self.Requires) do
            local componentCount = #components
            if componentCount == 0 then return false end
            if componentCount > 0 then
                local foundComponent = std.linq(components):firstOrDefault(
                    function(val)
                        return val.Name == value
                    end)
                if foundComponent == nil then
                    return false
                end
            end
        end
        self:Execute(gameObject)
        return true
    end
    return false
end

function component.new(componentName, requiredComponentAttributes)
    local self = setmetatable({}, mt)
    self.Name = componentName or "UNNAMED_COMPONENT"
    self.Requires = requiredComponentAttributes or {}
    return self
end

return component