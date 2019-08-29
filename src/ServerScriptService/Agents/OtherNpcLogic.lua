local npcLogic = {}

function npcLogic.GetRegenerateFunction(npcModel, parentForGeneratedModels)

    local backup = npcModel:Clone()

    local regenClosure = function ()

	    local generatedModel = backup:Clone()
	    generatedModel.Parent = parentForGeneratedModels
	    generatedModel:MakeJoints()
    end

    return regenClosure
end


return npcLogic