local require = require(game:GetService("ReplicatedStorage"):WaitForChild("Nevermore"))
local std = require("Std")
local randumb = std.randumb;

local module = {}

function module.GetRandomCFrameFromTableOfParts(candidatePartsTable)

	local chosenPart = randumb:GetOneAtRandom(candidatePartsTable)
    
	if chosenPart ~= nil then
        return CFrame.new(chosenPart.Position)
    end
    error("Unable to select a part from candidates table")
    return nil
end

return module;
