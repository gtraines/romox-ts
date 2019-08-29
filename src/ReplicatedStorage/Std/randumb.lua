
--[[
    Randomization helpers
]]

if os == nil then
    os = require("os`")
end

if math == nil then
    math = require("math")
end

local module = {
    __initialized = false,
    __currentSeed = 0,
    __previousSeed = 0,
    __twoSeedsAgo = 0
}

function module:Init(sortOfSeed)
    
    if sortOfSeed == nil or sortOfSeed == 0 then
        sortOfSeed = math.pi ^ 2
    end

    local intermediateSeed = ((os.time() + sortOfSeed) / 11130013)
 
    if math.abs(intermediateSeed - self.__twoSeedsAgo) < 3 then
        intermediateSeed = intermediateSeed * os.time()/ 11130013
    end

    if math.abs(intermediateSeed - self.__previousSeed) < 3 then
        intermediateSeed = intermediateSeed + math.log( os.time() )
    end
    
    if math.abs(intermediateSeed - self.__currentSeed) < 3 then
        intermediateSeed = math.fmod( intermediateSeed, 13 )
    end

    self.__twoSeedsAgo = self.__previousSeed
    self.__previousSeed = self.__currentSeed
    self.__currentSeed = intermediateSeed
    print("Random seed: " .. tostring(self.__currentSeed))
    math.randomseed(self.__currentSeed)
    self.__initialized = true
end

function module:GetOneAtRandom( collection )
    local collectionLength = #collection

    local selectedIndex = self:GetIntegerBtwn(1, collectionLength)
    return collection[selectedIndex]
end

function module:CoinFlip(choiceA, choiceB)
    local selectedValue = self:GetIntegerBtwn(1, 10)
    if selectedValue <= 5 then
        return choiceA
    else
        return choiceB
    end
end

function module:GetIntegerBtwn( start, finish )
    self:Init(11)
    return math.random(start, finish)
end

function module:ShuffleList(listToShuffle)
    self:Init()
    local shuffledList = {}
    -- The # operator may or may not actually return the correct value
    -- so we will do it sort of manually

    local itemCount = 0
    for _, val in pairs(listToShuffle) do
        itemCount = itemCount + 1
    end
    local availableIndices = itemCount

    for i=1,itemCount do
        local selectedIndex = math.random(1, availableIndices)
		local selectedItem = table.remove(listToShuffle, selectedIndex)
        table.insert(shuffledList, selectedItem)
        availableIndices = availableIndices - 1
    end

    return shuffledList
end


return module