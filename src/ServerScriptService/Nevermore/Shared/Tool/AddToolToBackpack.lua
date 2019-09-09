local PlayersService = game:GetService("Players")

local module = {

}

--Dont mess with any of this
function module.AddOnClick(clickDetector, toolInstance)
    local clickHandler = function(playerThatClicked)
        if not playerThatClicked.Backpack:FindFirstChild(toolInstance.Name) then
            local clonedTool = toolInstance:Clone()
            clonedTool.Parent = playerThatClicked.Backpack
        end
    end

    return clickDetector.MouseClick:Connect(clickHandler)
end

function module.RemoveOnTouched(partToTouch, toolName)
    local touchedHandler = function (obj)
        if obj.Parent:FindFirstChild("Humanoid")~=nil then
            local foundPlayer = PlayersService:FindFirstChild(obj.Parent.Name)
            if foundPlayer ~= nil then
                local backpackContents =foundPlayer.Backpack:GetChildren()
                for _, item in pairs(backpackContents) do
                    if item.Name == toolName then
                        item:Remove()
                    end
                end
            end
        end
        wait(0.2)
    end

    return partToTouch.Touched:Connect(touchedHandler)
end

return module