-- EasyConfiguration.lua
-- @author Quenty
-- Last Modified February 3rd, 2014

local lib = {}

local function Modify(Instance, Values)
	-- Modifies an Instance by using a table.  

	assert(type(Values) == "table", "Values is not a table");
	--[[
		The pairs function, which iterates over all elements in a table, is similar, 
			except that the iterator function is the "next" function, which is a primitive function in Lua:

    function pairs (t)
      return next, t, nil
    end
	The call next(t, k), where k is a key of the table t, 
	returns a next key in the table, in an arbitrary order. 
	(It returns also the value associated with that key, as a second return value.) 
	The call next(t, nil) returns a first pair. When there are no more pairs, next returns nil.
	Some people prefer to use next directly, without calling pairs:

    	for k, v in next, t do
      		...
    	end
	Remember that the expression list of the for loop is adjusted to three results, 
	so Lua gets next, t, and nil, exactly what it gets when it calls pairs(t).
	]]
	for Index, Value in next, Values do
		if type(Index) == "number" then
			Value.Parent = Instance
		else
			Instance[Index] = Value
		end
	end
	return Instance
end

local function Make(ClassType, Properties)
	-- Using a syntax hack to create a nice way to Make new items.  

	return Modify(Instance.new(ClassType), Properties)
end

local AcceptableTypes = { -- Anything in here has a .Value property. 
	["StringValue"]         = true;
	["IntValue"]            = true;
	["NumberValue"]         = true;
	["BrickColorValue"]     = true;
	["BoolValue"]           = true;
	["Color3Value"]         = true;
	["Vector3Value"]        = true;
	["IntConstrainedValue"] = true;
}

local function TypeIsAcceptable(TypeName)
	return AcceptableTypes[TypeName]
end
lib.TypeIsAcceptable = TypeIsAcceptable;
lib.typeIsAcceptable = TypeIsAcceptable

local function AddSubDataLayer(DataName, Parent)
	-- For organization of data. Adds another configuration with the name "DataName", if one can't be found, and then returns it. 

	local DataContainer = Parent:FindFirstChild(DataName) or Make("Configuration", {
		Name = DataName;
		Parent = Parent;
		Archivable = true;
	})

	return DataContainer
end
lib.AddSubDataLayer = AddSubDataLayer
lib.addSubDataLayer = AddSubDataLayer

local EasyConfigCache = {}
setmetatable(EasyConfigCache, {__mode = "k"})

local function MakeEasyConfiguration(Configuration)
	if EasyConfigCache[Configuration] then
		return EasyConfigCache[Configuration]
	else
		local NewConfiguration = {}

		local function Get(ObjectName)
			return Configuration:FindFirstChild(ObjectName)
		end

		setmetatable(NewConfiguration, {
			__index = function(_, value)

				if not type(value) == "string" then
					error("Only Indexing with strings is supported with easyConfiguration", 2)
				end

				local loweredValue = value:lower()

				if loweredValue == "add" or loweredValue == "addvalue" then
					--[[ 
					So they can do stuff like... Config.AddValue('IntValue', {
						Name = "PizzaEaten"
						Value = 0;
					})

					--]]
					return function(valueType, values)
						local Object

						if values and values.Name and type(values.Name) == "string" then
							Object = Get(values.Name)
							if Object and Object.ClassName ~= valueType then
								print("[EasyConfiguration] - Invalid class '"..Object.ClassName.."' in configuration, being replaced by new data '"..valueType.."'");
								Object:Destroy()
								Object = nil;
							end
						else
							error("[EasyConfiguration] - No values received in the add method of easy configuration. Please give a table of default properties including the name. ", 2)
						end

						if not Object then
							local newInstance = Instance.new(valueType)
							Modify(newInstance, values)
							newInstance.Parent = Configuration
						end
					end
				elseif loweredValue == "get" or loweredValue == "getvalue" then
					return function(name)
						return Get(name)
					end
				elseif loweredValue == "getcontainer" then
					return function(name)
						return Get(name)
					end
				else
					local Object = Configuration:FindFirstChild(value)
					if Object and AcceptableTypes[Object.ClassName] then
						return Object.Value
					else
						error("[EasyConfiguration] - " .. (Object and "Object '"..value.."' was a "..type(Object).." value, and not acceptable, so no return was given" or "Could not find Object '"..value.."' in the configuration"), 2)
					end
				end
			end;
			__newindex = function(_, value, newValue)
				if type(value) == "string" then
					local Object = Get(value)
					if Object and AcceptableTypes[Object.ClassName] then
						Object.Value = newValue;
					else
						error("[EasyConfiguration] - Value '" .. value .. "' was not accepted, or wasn't in the configuration", 2);
					end
				else
					error("[EasyConfiguration] - Index with a string")
				end
			end;
		})

		EasyConfigCache[Configuration] = NewConfiguration
		return NewConfiguration;
	end
end
lib.Make = MakeEasyConfiguration;
lib.MakeEasyConfiguration = MakeEasyConfiguration;

return lib