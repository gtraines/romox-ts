-- @author Mark Otaris (ColorfulBody, JulienDethurens) and Quenty
-- Last modified December 28th, 2013

-- This library contains a collection of clever hacks.
-- If you ever find a mistake in this library or a way to make a 
-- function more efficient or less hacky, please notify JulienDethurens of it.

-- As far as is known, the functions in this library are foolproof. 
-- It cannot be fooled by a fake value that looks like a real one. 
-- If it says a value is a CFrame, then it _IS_ a CFrame, period.


local t = {}

local function set(object, property, value)
	-- Sets the 'property' property of 'object' to 'value'.
	-- This is used with pcall to avoid creating functions needlessly.
	object[property] = value
end
-- t: a runtime typechecker for Roblox

-- regular lua compatibility
local typeof = typeof or type

local function primitive(typeName)
	return function(value)
		local valueType = typeof(value)
		if valueType == typeName then
			return true
		else
			return false, string.format("%s expected, got %s", typeName, valueType)
		end
	end
end

function t.isAnInstance(value)
	-- Returns whether 'value' is an Instance value.
	local _, result = pcall(Game.IsA, value, 'Instance')
	return result == true
end

function t.isALibrary(value)
	-- Returns whether 'value' is a RbxLibrary.
	-- Finds its result by checking whether the value's GetApi function (if it has one) can be dumped (and therefore is a non-Lua function).
	if pcall(function() assert(type(value.GetApi) == 'function') end) then -- Check if the value has a GetApi function.
		local success, result = pcall(string.dump, value.GetApi) -- Try to dump the GetApi function.
		return result == "unable to dump given function" -- Return whether the GetApi function could be dumped.
	end
	return false
end

function t.isAnEnum(value)
	-- Returns whether the value is an enum.
	return pcall(Enum.Material.GetEnumItems, value) == true
end

function t.coerceIntoEnum(value, enum)
	-- Coerces a value into an enum item, if possible, throws an error otherwise.
	if lib.isAnEnum(enum) then
		for _, enum_item in next, enum:GetEnumItems() do
			if value == enum_item or value == enum_item.Name or value == enum_item.Value then return enum_item end
		end
	else
		error("The 'enum' argument must be an enum.", 2)
	end
	error("The value cannot be coerced into a enum item of the specified type.", 2)
end

function t.isOfEnumType(value, enum)
	-- Returns whether 'value' is coercible into an enum item of the type 'enum'.
	if t.isAnEnum(enum) then
		return pcall(t.coerceIntoEnum, value, enum) == true
	else
		error("The 'enum' argument must be an enum.", 2)
	end
end


-- function lib.isAColor3(value)
-- 	-- Returns whether 'value' is a Color3 value.
-- 	--local Color3Value = Instance.new('Color3Value')
-- 	-- return pcall(set, Color3Value, 'Value', value) == true
-- 	local toHSVMethod = value['toHSV']
-- 	if toHSVMethod ~= nil then
-- 		return true
-- 	end
-- 	return false
-- end


-- -- function lib.isACoordinateFrame(value)
-- -- 	-- Returns whether 'value' is a CFrame value.
-- -- 	-- local CFrameValue = Instance.new('CFrameValue')
-- -- 	-- return pcall(set, CFrameValue, 'Value', value) == true

-- -- end

-- -- local BrickColor3Value = Instance.new('BrickColorValue')
-- -- function lib.isABrickColor(value)
-- -- 	-- Returns whether 'value' is a BrickColor value.
-- -- 	return pcall(set, BrickColor3Value, 'Value', value) == true
-- -- end

-- local RayValue = Instance.new('RayValue')
-- function lib.isARay(value)
-- 	-- Returns whether 'value' is a Ray value.
-- 	return pcall(set, RayValue, 'Value', value) == true
-- end

-- local Vector3Value = Instance.new('Vector3Value')
-- function lib.isAVector3(value)
-- 	-- Returns whether 'value' is a Vector3 value.
-- 	return pcall(set, Vector3Value, 'Value', value) == true
-- end

-- function lib.isAVector2(value)
-- 	-- Returns whether 'value' is a Vector2 value.
-- 	return pcall(function() return Vector2.new() + value end) == true
-- end

-- local FrameValue = Instance.new('Frame')
-- function lib.isAUdim2(value)
-- 	-- Returns whether 'value' is a UDim2 value.
-- 	return pcall(set, FrameValue, 'Position', value) == true
-- end

-- function lib.isAUDim(value)
-- 	-- Returns whether 'value' is a UDim value.
-- 	return pcall(function() return UDim.new() + value end) == true
-- end

-- local ArcHandleValue = Instance.new('ArcHandles')
-- function lib.isAAxis(value)
-- 	-- Returns whether 'value' is an Axes value.
-- 	return pcall(set, ArcHandleValue, 'Axes', value) == true
-- end

-- local FaceValue = Instance.new('Handles')
-- function lib.isAFace(value)
-- 	-- Returns whether 'value' is a Faces value.
-- 	return pcall(set, FaceValue, 'Faces', value) == true
-- end

-- function lib.isASignal(value)
-- 	-- Returns whether 'value' is a RBXScriptSignal.
-- 	local success, connection = pcall(function() return Game.AllowedGearTypeChanged.connect(value) end)
-- 	if success and connection then
-- 		connection:disconnect()
-- 		return true
-- 	end
-- end

	
-- function lib.getType(value)
-- 	-- Returns the most specific obtainable type of a value it can.
-- 	-- Useful for error messages or anything that is meant to be shown to the user.

-- 	local valueType = type(value)

-- 	if valueType == 'userdata' then
-- 		if lib.isAnInstance(value) then return value.ClassName
-- 		elseif lib.isAColor3(value) then return 'Color3'
-- 		elseif lib.isACoordinateFrame(value) then return 'CFrame'
-- 		elseif lib.isABrickColor(value) then return 'BrickColor'
-- 		elseif lib.isAUDim2(value) then return 'UDim2'
-- 		elseif lib.isAUDim(value) then return 'UDim'
-- 		elseif lib.isAVector3(value) then return 'Vector3'
-- 		elseif lib.isAVector2(value) then return 'Vector2'
-- 		elseif lib.isARay(value) then return 'Ray'
-- 		elseif lib.isAnEnum(value) then return 'Enum'
-- 		elseif lib.isASignal(value) then return 'RBXScriptSignal'
-- 		elseif lib.isALibrary(value) then return 'RbxLibrary'
-- 		elseif lib.isAAxis(value) then return 'Axes'
-- 		elseif lib.isAFace(value) then return 'Faces'
-- 		end
-- 	else
-- 		return valueType;
-- 	end
-- end

-- function lib.isAnInt(value)
-- 	-- Returns whether 'value' is an interger or not
-- 	return type(value) == "number" and value % 1 == 1;
-- end


-- function lib.isPositiveInt(number)
-- 	-- Returns whether 'value' is a positive interger or not.  
-- 	-- Useful for money transactions, and is used in the method isAnArray ( )
-- 	return type(value) == "number" and number > 0 and math.floor(number) == number
-- end


-- function lib.isAnArray(value)
-- 	-- Returns if 'value' is an array or not

-- 	if type(value) == "table" then
-- 		local maxNumber = 0;
-- 		local totalCount = 0;

-- 		for index, _ in next, value do
-- 			if lib.isPositiveInt(index) then
-- 				maxNumber = math.max(maxNumber, index)
-- 				totalCount = totalCount + 1
-- 			else
-- 				return false;
-- 			end
-- 		end

-- 		return maxNumber == totalCount;
-- 	else
-- 		return false;
-- 	end
-- end

--[[**
	matches any type except nil

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
function t.any(value)
	if value ~= nil then
		return true
	else
		return false, "any expected, got nil"
	end
end

--Lua primitives

--[[**
	ensures Lua primitive boolean type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.boolean = primitive("boolean")

--[[**
	ensures Lua primitive coroutine type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.coroutine = primitive("thread")

--[[**
	ensures Lua primitive callback type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.callback = primitive("function")

--[[**
	ensures Lua primitive none type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.none = primitive("nil")

--[[**
	ensures Lua primitive string type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.string = primitive("string")

--[[**
	ensures Lua primitive table type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.table = primitive("table")

--[[**
	ensures Lua primitive userdata type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.userdata = primitive("userdata")

--[[**
	ensures value is a number and non-NaN

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
function t.number(value)
	local valueType = typeof(value)
	if valueType == "number" then
		if value == value then
			return true
		else
			return false, "unexpected NaN value"
		end
	else
		return false, string.format("number expected, got %s", valueType)
	end
end

--[[**
	ensures value is NaN

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
function t.nan(value)
	if value ~= value then
		return true
	else
		return false, "unexpected non-NaN value"
	end
end

-- roblox types

--[[**
	ensures Roblox Axes type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Axes = primitive("Axes")

--[[**
	ensures Roblox BrickColor type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.BrickColor = primitive("BrickColor")

--[[**
	ensures Roblox CFrame type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.CFrame = primitive("CFrame")

--[[**
	ensures Roblox Color3 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Color3 = primitive("Color3")

--[[**
	ensures Roblox ColorSequence type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.ColorSequence = primitive("ColorSequence")

--[[**
	ensures Roblox ColorSequenceKeypoint type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.ColorSequenceKeypoint = primitive("ColorSequenceKeypoint")

--[[**
	ensures Roblox DockWidgetPluginGuiInfo type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.DockWidgetPluginGuiInfo = primitive("DockWidgetPluginGuiInfo")

--[[**
	ensures Roblox Faces type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Faces = primitive("Faces")

--[[**
	ensures Roblox Instance type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Instance = primitive("Instance")

--[[**
	ensures Roblox NumberRange type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.NumberRange = primitive("NumberRange")

--[[**
	ensures Roblox NumberSequence type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.NumberSequence = primitive("NumberSequence")

--[[**
	ensures Roblox NumberSequenceKeypoint type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.NumberSequenceKeypoint = primitive("NumberSequenceKeypoint")

--[[**
	ensures Roblox PathWaypoint type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.PathWaypoint = primitive("PathWaypoint")

--[[**
	ensures Roblox PhysicalProperties type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.PhysicalProperties = primitive("PhysicalProperties")

--[[**
	ensures Roblox Random type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Random = primitive("Random")

--[[**
	ensures Roblox Ray type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Ray = primitive("Ray")

--[[**
	ensures Roblox Rect type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Rect = primitive("Rect")

--[[**
	ensures Roblox Region3 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Region3 = primitive("Region3")

--[[**
	ensures Roblox Region3int16 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Region3int16 = primitive("Region3int16")

--[[**
	ensures Roblox TweenInfo type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.TweenInfo = primitive("TweenInfo")

--[[**
	ensures Roblox UDim type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.UDim = primitive("UDim")

--[[**
	ensures Roblox UDim2 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.UDim2 = primitive("UDim2")

--[[**
	ensures Roblox Vector2 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Vector2 = primitive("Vector2")

--[[**
	ensures Roblox Vector3 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Vector3 = primitive("Vector3")

--[[**
	ensures Roblox Vector3int16 type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Vector3int16 = primitive("Vector3int16")

-- roblox enum types

--[[**
	ensures Roblox Enum type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.Enum = primitive("Enum")

--[[**
	ensures Roblox EnumItem type

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
t.EnumItem = primitive("EnumItem")

--[[**
	ensures value is a given literal value

	@param literal The literal to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.literal(literal)
	return function(value)
		if value ~= literal then
			return false, string.format("expected %s, got %s", tostring(literal), tostring(value))
		end
		return true
	end
end

--[[**
	DEPRECATED
	Please use t.literal
**--]]
t.exactly = t.literal

--[[**
	ensures value is an integer

	@param value The value to check against

	@returns True iff the condition is satisfied, false otherwise
**--]]
function t.integer(value)
	local success, errMsg = t.number(value)
	if not success then
		return false, errMsg or ""
	end
	if value%1 == 0 then
		return true
	else
		return false, string.format("integer expected, got %s", value)
	end
end

--[[**
	ensures value is a number where min <= value

	@param min The minimum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberMin(min)
	return function(value)
		local success, errMsg = t.number(value)
		if not success then
			return false, errMsg or ""
		end
		if value >= min then
			return true
		else
			return false, string.format("number >= %s expected, got %s", min, value)
		end
	end
end

--[[**
	ensures value is a number where value <= max

	@param max The maximum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberMax(max)
	return function(value)
		local success, errMsg = t.number(value)
		if not success then
			return false, errMsg
		end
		if value <= max then
			return true
		else
			return false, string.format("number <= %s expected, got %s", max, value)
		end
	end
end

--[[**
	ensures value is a number where min < value

	@param min The minimum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberMinExclusive(min)
	return function(value)
		local success, errMsg = t.number(value)
		if not success then
			return false, errMsg or ""
		end
		if min < value then
			return true
		else
			return false, string.format("number > %s expected, got %s", min, value)
		end
	end
end

--[[**
	ensures value is a number where value < max

	@param max The maximum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberMaxExclusive(max)
	return function(value)
		local success, errMsg = t.number(value)
		if not success then
			return false, errMsg or ""
		end
		if value < max then
			return true
		else
			return false, string.format("number < %s expected, got %s", max, value)
		end
	end
end

--[[**
	ensures value is a number where value > 0

	@returns A function that will return true iff the condition is passed
**--]]
t.numberPositive = t.numberMinExclusive(0)

--[[**
	ensures value is a number where value < 0

	@returns A function that will return true iff the condition is passed
**--]]
t.numberNegative = t.numberMaxExclusive(0)

--[[**
	ensures value is a number where min <= value <= max

	@param min The minimum to use
	@param max The maximum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberConstrained(min, max)
	assert(t.number(min) and t.number(max))
	local minCheck = t.numberMin(min)
	local maxCheck = t.numberMax(max)
	return function(value)
		local minSuccess, minErrMsg = minCheck(value)
		if not minSuccess then
			return false, minErrMsg or ""
		end

		local maxSuccess, maxErrMsg = maxCheck(value)
		if not maxSuccess then
			return false, maxErrMsg or ""
		end

		return true
	end
end

--[[**
	ensures value is a number where min < value < max

	@param min The minimum to use
	@param max The maximum to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.numberConstrainedExclusive(min, max)
	assert(t.number(min) and t.number(max))
	local minCheck = t.numberMinExclusive(min)
	local maxCheck = t.numberMaxExclusive(max)
	return function(value)
		local minSuccess, minErrMsg = minCheck(value)
		if not minSuccess then
			return false, minErrMsg or ""
		end

		local maxSuccess, maxErrMsg = maxCheck(value)
		if not maxSuccess then
			return false, maxErrMsg or ""
		end

		return true
	end
end

--[[**
	ensures value is either nil or passes check

	@param check The check to use

	@returns A function that will return true iff the condition is passed
**--]]
function t.optional(check)
	assert(t.callback(check))
	return function(value)
		if value == nil then
			return true
		end
		local success, errMsg = check(value)
		if success then
			return true
		else
			return false, string.format("(optional) %s", errMsg or "")
		end
	end
end

--[[**
	matches given tuple against tuple type definition

	@param ... The type definition for the tuples

	@returns A function that will return true iff the condition is passed
**--]]
function t.tuple(...)
	local checks = {...}
	return function(...)
		local args = {...}
		for i = 1, #checks do
			local success, errMsg = checks[i](args[i])
			if success == false then
				return false, string.format("Bad tuple index #%s:\n\t%s", i, errMsg or "")
			end
		end
		return true
	end
end

--[[**
	ensures all keys in given table pass check

	@param check The function to use to check the keys

	@returns A function that will return true iff the condition is passed
**--]]
function t.keys(check)
	assert(t.callback(check))
	return function(value)
		local tableSuccess, tableErrMsg = t.table(value)
		if tableSuccess == false then
			return false, tableErrMsg or ""
		end

		for key in pairs(value) do
			local success, errMsg = check(key)
			if success == false then
				return false, string.format("bad key %s:\n\t%s", tostring(key), errMsg or "")
			end
		end

		return true
	end
end

--[[**
	ensures all values in given table pass check

	@param check The function to use to check the values

	@returns A function that will return true iff the condition is passed
**--]]
function t.values(check)
	assert(t.callback(check))
	return function(value)
		local tableSuccess, tableErrMsg = t.table(value)
		if tableSuccess == false then
			return false, tableErrMsg or ""
		end

		for key, val in pairs(value) do
			local success, errMsg = check(val)
			if success == false then
				return false, string.format("bad value for key %s:\n\t%s", tostring(key), errMsg or "")
			end
		end

		return true
	end
end

--[[**
	ensures value is a table and all keys pass keyCheck and all values pass valueCheck

	@param keyCheck The function to use to check the keys
	@param valueCheck The function to use to check the values

	@returns A function that will return true iff the condition is passed
**--]]
function t.map(keyCheck, valueCheck)
	assert(t.callback(keyCheck), t.callback(valueCheck))
	local keyChecker = t.keys(keyCheck)
	local valueChecker = t.values(valueCheck)
	return function(value)
		local keySuccess, keyErr = keyChecker(value)
		if not keySuccess then
			return false, keyErr or ""
		end

		local valueSuccess, valueErr = valueChecker(value)
		if not valueSuccess then
			return false, valueErr or ""
		end

		return true
	end
end

do
	local arrayKeysCheck = t.keys(t.integer)
	--[[**
		ensures value is an array and all values of the array match check

		@param check The check to compare all values with

		@returns A function that will return true iff the condition is passed
	**--]]
	function t.array(check)
		assert(t.callback(check))
		local valuesCheck = t.values(check)
		return function(value)
			local keySuccess, keyErrMsg = arrayKeysCheck(value)
			if keySuccess == false then
				return false, string.format("[array] %s", keyErrMsg or "")
			end

			-- # is unreliable for sparse arrays
			-- Count upwards using ipairs to avoid false positives from the behavior of #
			local arraySize = 0

			for _, _ in ipairs(value) do
				arraySize = arraySize + 1
			end

			for key in pairs(value) do
				if key < 1 or key > arraySize then
					return false, string.format("[array] key %s must be sequential", tostring(key))
				end
			end

			local valueSuccess, valueErrMsg = valuesCheck(value)
			if not valueSuccess then
				return false, string.format("[array] %s", valueErrMsg or "")
			end

			return true
		end
	end
end

do
	local callbackArray = t.array(t.callback)
	--[[**
		creates a union type

		@param ... The checks to union

		@returns A function that will return true iff the condition is passed
	**--]]
	function t.union(...)
		local checks = {...}
		assert(callbackArray(checks))
		return function(value)
			for _, check in pairs(checks) do
				if check(value) then
					return true
				end
			end
			return false, "bad type for union"
		end
	end

	--[[**
		Alias for t.union
	**--]]
	t.some = t.union

	--[[**
		creates an intersection type

		@param ... The checks to intersect

		@returns A function that will return true iff the condition is passed
	**--]]
	function t.intersection(...)
		local checks = {...}
		assert(callbackArray(checks))
		return function(value)
			for _, check in pairs(checks) do
				local success, errMsg = check(value)
				if not success then
					return false, errMsg or ""
				end
			end
			return true
		end
	end

	--[[**
		Alias for t.intersection
	**--]]
	t.every = t.intersection
end

do
	local checkInterface = t.map(t.any, t.callback)
	--[[**
		ensures value matches given interface definition

		@param checkTable The interface definition

		@returns A function that will return true iff the condition is passed
	**--]]
	function t.interface(checkTable)
		assert(checkInterface(checkTable))
		return function(value)
			local tableSuccess, tableErrMsg = t.table(value)
			if tableSuccess == false then
				return false, tableErrMsg or ""
			end

			for key, check in pairs(checkTable) do
				local success, errMsg = check(value[key])
				if success == false then
					return false, string.format("[interface] bad value for %s:\n\t%s", tostring(key), errMsg or "")
				end
			end
			return true
		end
	end

	--[[**
		ensures value matches given interface definition strictly

		@param checkTable The interface definition

		@returns A function that will return true iff the condition is passed
	**--]]
	function t.strictInterface(checkTable)
		assert(checkInterface(checkTable))
		return function(value)
			local tableSuccess, tableErrMsg = t.table(value)
			if tableSuccess == false then
				return false, tableErrMsg or ""
			end

			for key, check in pairs(checkTable) do
				local success, errMsg = check(value[key])
				if success == false then
					return false, string.format("[interface] bad value for %s:\n\t%s", tostring(key), errMsg or "")
				end
			end

			for key in pairs(value) do
				if not checkTable[key] then
					return false, string.format("[interface] unexpected field '%s'", tostring(key))
				end
			end

			return true
		end
	end
end

--[[**
	ensure value is an Instance and it's ClassName matches the given ClassName

	@param className The class name to check for

	@returns A function that will return true iff the condition is passed
**--]]
function t.instance(className)
	assert(t.string(className))
	return function(value)
		local instanceSuccess, instanceErrMsg = t.Instance(value)
		if not instanceSuccess then
			return false, instanceErrMsg or ""
		end

		if value.ClassName ~= className then
			return false, string.format("%s expected, got %s", className, value.ClassName)
		end

		return true
	end
end

--[[**
	ensure value is an Instance and it's ClassName matches the given ClassName by an IsA comparison

	@param className The class name to check for

	@returns A function that will return true iff the condition is passed
**--]]
function t.instanceIsA(className)
	assert(t.string(className))
	return function(value)
		local instanceSuccess, instanceErrMsg = t.Instance(value)
		if not instanceSuccess then
			return false, instanceErrMsg or ""
		end

		if not value:IsA(className) then
			return false, string.format("%s expected, got %s", className, value.ClassName)
		end

		return true
	end
end

--[[**
	ensures value is an enum of the correct type

	@param enum The enum to check

	@returns A function that will return true iff the condition is passed
**--]]
function t.enum(enum)
	assert(t.Enum(enum))
	return function(value)
		local enumItemSuccess, enumItemErrMsg = t.EnumItem(value)
		if not enumItemSuccess then
			return false, enumItemErrMsg
		end

		if value.EnumType == enum then
			return true
		else
			return false, string.format("enum of %s expected, got enum of %s", tostring(enum), tostring(value.EnumType))
		end
	end
end

do
	local checkWrap = t.tuple(t.callback, t.callback)

	--[[**
		wraps a callback in an assert with checkArgs

		@param callback The function to wrap
		@param checkArgs The functon to use to check arguments in the assert

		@returns A function that first asserts using checkArgs and then calls callback
	**--]]
	function t.wrap(callback, checkArgs)
		assert(checkWrap(callback, checkArgs))
		return function(...)
			assert(checkArgs(...))
			return callback(...)
		end
	end
end

--[[**
	asserts a given check

	@param check The function to wrap with an assert

	@returns A function that simply wraps the given check in an assert
**--]]
function t.strict(check)
	return function(...)
		assert(check(...))
	end
end

return t