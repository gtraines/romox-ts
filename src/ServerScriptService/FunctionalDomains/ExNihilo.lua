--- Sugar for creating items out of thin air
-- @module ExNihilo

-- @export table actually exported by the module for use

local libFinder = require(game:GetService("ServerScriptService")
    :WaitForChild("Finders", 5)
    :WaitForChild("LibFinder", 5))

local linq = libFinder:FindLib("linq")
local uuid = libFinder:FindLib("uuid")
local serverStorage =  game:GetService("ServerStorage")

local module = {}
--[[
    When working with collections and tags, it’s a good idea to use an object-oriented programming style. 
    In almost all situations, tagged objects have their own identity, state and behavior. 
    The pattern goes like this: 
        when a tag is found (CollectionService:GetTagged and CollectionService:GetInstanceAddedSignal), 
           create a Lua object with the Roblox instance. 
        When it is removed (CollectionService:GetInstanceRemovedSignal), 
            call a cleanup/destroy method within the Lua object. 
    See the code samples for a better idea of how this can be done.

    When tags replicate, all tags on an object replicate at the same time. 
    Therefore, 
        if you set a tag on an object from the client 
        then add/remove a different tag on the same object from the server, 
            the client’s local tags on the object are overwritten.
]]


-- ExampleSetterFunction = exNihilo.MoveModelToCoordFrame(workspace:WaitForChild("Model"), CFrame.new(0,5,0))
function module.MoveModelToCoordFrame( modelWithPrimaryPart, newCoordFrame )
    print("Destination for spawn:  " .. tostring(newCoordFrame))
    local Primary = modelWithPrimaryPart.PrimaryPart or error(modelWithPrimaryPart.Name .. " has no PrimaryPart")
    local PrimaryCF = Primary.CFrame
    local Cache = {}
    
    for _, Desc in next, modelWithPrimaryPart:GetDescendants() do
        if Desc ~= Primary and Desc:IsA("BasePart") then
            Cache[Desc] = PrimaryCF:toObjectSpace(Desc.CFrame)
        end
    end

    Primary.CFrame = newCoordFrame
    for Part, Offset in next, Cache do
        Part.CFrame = newCoordFrame * Offset
        
    end
end

-- createdModelCallback takes the createdModel as its only parameter
function module.CreateFromServerStorage( storageCategory, prototypeId, coordsForNewInstance, createdModelCallback, targetParent )
    local storageCategoryFolder = serverStorage:FindFirstChild(storageCategory)
    
    local foundPrototype = linq(storageCategoryFolder:GetChildren()):firstOrDefault(function( itm )

        local itmPrototypeId = itm:FindFirstChild("PrototypeId")
        
        if (itmPrototypeId ~= nil) then
            print("Found item prototype: " .. prototypeId)
            return itmPrototypeId.Value == prototypeId
        end
        return false
    end)

    if foundPrototype == nil then
        foundPrototype = linq(storageCategoryFolder:GetChildren()):firstOrDefault(function( itm )
            return itm.Name == prototypeId
        end)
    end

    if foundPrototype == nil then
        error("Could not find Prototype: " .. prototypeId)
        return nil
    end

    spawn(function ()
        local createdItem = foundPrototype:Clone()
        local entityIdObj = createdItem:FindFirstChild("EntityId")
        if entityIdObj == nil then
            entityIdObj = Instance.new("StringValue")
            entityIdObj.Parent = createdItem
        end
        entityIdObj.Value = uuid()
        createdItem.Parent = targetParent or game:GetService("Workspace")
        
        module.MoveModelToCoordFrame(createdItem, coordsForNewInstance)
        if createdModelCallback ~= nil then
            createdModelCallback(createdItem)
        end
    end)
end

return module