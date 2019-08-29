local ReplicatedStorage = game:GetService("ReplicatedStorage")
local stdFolder = ReplicatedStorage:WaitForChild("Std")
local t = require(stdFolder:WaitForChild("t"))

local module = {
    CommaSeparated = function (list)
        if #list == 1 then
            return tostring(list[1])
        elseif #list == 2 then
            return list[1] .. " and " .. list[2]
        else
            local lastItem = table.remove(list)
            local text = table.concat(list, ", ") .. ", and " .. lastItem
            table.insert(list, lastItem)
            return text
        end
    end,
    Map = function(func, list)
        for index,value in pairs(list) do
            list[index] = func(value)
        end
        
        return list
    end
}
function module.BreadthFirst(entity, levelsRemaining, funcToRunOnEachEntity)
    -- @param [Instance] entity entity to start search
	-- @param [Number] levelsRemaining Levels of entities deep to continue searching
	-- @param [function] The function to run on each entity
	if (levelsRemaining <= 0 or entity == nil) then
		return
	end
	
	local entityChilds = entity:GetChildren()
	
	for _, entitiesChild in pairs(entityChilds) do
		funcToRunOnEachEntity(entitiesChild)
		module.BreadthFirst(entitiesChild, levelsRemaining - 1, funcToRunOnEachEntity)
    end
end

module.ContainsValue = function(tbl, val)
	for i,v in pairs(tbl) do
		if v == val then
			return i
		end
	end
	
	return false
end

module.Length = function(tbl)
	local len = 0
	
	for _,_ in pairs(tbl) do
		len = len + 1
	end
	
	return len
end

module.len = function(tbl)
	local len = 0
	
	for _,_ in pairs(tbl) do
		len = len + 1
	end
	
	return len
end

module.keys = function(tbl)
	local ret = {}
	
	for key,_ in pairs(tbl) do
		table.insert(ret, key)
	end
	
	return ret
end

module.values = function(tbl)
	local ret = {}
	
	for _,val in pairs(tbl) do
		table.insert(ret, val)
	end
	
	return ret
end

--sort by keys
module.xsort = function(tbl, sort)
	local keys = module.keys(tbl)
	
	table.sort(keys, sort)
	
	return function()
		if #keys == 0 then
			return nil
		end
		
		local nextValue = table.remove(keys, 1)
		
		return nextValue, tbl[nextValue]
	end
end

--sort by values
module.vsort = function(tbl, sort)
	sort = sort or function(x, y)
		return x > y
	end
	
	return module.xsort(tbl, function(x, y)
		return sort(tbl[x], tbl[y])
	end)
end

module.choice = function(tbl, resultCount)
	resultCount = resultCount or 1
	
	local results = {}
	
	--clone the table
	local clone = {}
	
	for i,v in pairs(tbl) do
		clone[i] = v
	end
	
	local keys = module.keys(clone)
	
	for i=1,math.min(#tbl, math.max(resultCount, 1)) do
		table.insert(results, tbl[table.remove(keys, math.random(#keys))])
	end
	
	return unpack(results)
end

module.one = function(tbl)
	return tbl[math.random(#tbl)]
end

module.shallow = function(tbl)
	local clone = {}
	
	for key,val in pairs(tbl) do
		clone[key] = val
	end
	
	return clone
end

module.deep = function(tbl)
	local clone = {}
	
	for key,val in pairs(tbl) do
		if typeof(val) == "table" then
			clone[key] = module.deep(val)
		else
			clone[key] = val
		end
	end
	
	return clone
end

module.cloneKeys = function(tbl)
	local ret = {}
	
	for key,_ in pairs(tbl) do
		ret[key] = true
	end
	
	return ret
end

module.dump = function(tbl, prefix)
	prefix = prefix or ""
	
	for key,val in pairs(tbl) do
		print(("%s%s = %s"):format(prefix, tostring(key), tostring(val)))
		
		if typeof(val) == "table" then
			module.dump(val, ("%s.%s"):format(prefix, key))
		end
	end
end

module.merge = function(tbl, ...)
	local ret = {}
	
	for _,tbl in pairs({tbl, ...}) do
		for _,value in pairs(tbl) do
			table.insert(ret, value)
		end
	end
	
	return ret
end



--[[
	Returns an array of keys from the given object, sorted alphabetically.

	This is used so we get a consistent, alphabetical output for tables.
	Typically dicctionary-like tables aren't sorted, so this fixes that.

	Usage:

		local object = {
			delta = true,
			alpha = true,
			bravo = true,
		}

		local keys = getSortedKeys(object)

		for _, key in pairs(keys) do
			print(key)
		end

		-- "alpha"
		-- "bravo"
		-- "delta"
]]

module._getSortedKeysCheck = t.table
function module.GetSortedKeys(object)
	assert(module._getSortedKeysCheck(object))

    local keys = {}

    for k in pairs(object) do
        table.insert(keys, k)
    end

    table.sort(keys)

    return keys
end


return setmetatable(module, {
	__index = table
})