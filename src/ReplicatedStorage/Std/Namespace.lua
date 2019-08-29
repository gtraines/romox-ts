local ReplicatedStorage = game:GetService("ReplicatedStorage")

local stdFolder = ReplicatedStorage:WaitForChild("Std", 1)

local stdlib = require(stdFolder:WaitForChild("_registerLibs", 2))

function stdlib.into(value, into)
	into.value = value
	return value
end

--[[
	Binds a method with its object so that it can be used independently.

	This is useful when exposing a method when you don't also want to attach the
	object to it. For example, when exporting an API.

	Usage:

		local obj = {
			str = "Example",
			foo = function(self)
				print(self.str)
			end
		}

		local method = bind(obj, obj.foo)

		print(method()) -- "Example"
]]


local bindCheck = stdlib.t.tuple(stdlib.t.table, stdlib.t.callback)

function stdlib.bind(obj, method)
	assert(bindCheck(obj, method))

	return function(...)
		return method(obj, ...)
	end
end

--[[
	Converts a value into a nicely formatted string.

	This is mostly used for tables as a way to inspect the contents. inspect.lua
	is the next best thing, but is a bit slow and bogs things down if used in
	succession. This function is a lot more lightweight.

	Usage:

		local t = {
			foo = true,
			bar = false
		}

		print(pretty(t))
]]

stdlib._prettyCheck = stdlib.t.tuple(stdlib.t.any, stdlib.t.optional(stdlib.t.integer))
function stdlib.repr(value, indentLevel)
	assert(stdlib._prettyCheck(value, indentLevel))

    indentLevel = indentLevel or 0

    local output = {}
    local indent = "    "

    if typeof(value) == "table" then
        table.insert(output, "{\n")

        for _, k in pairs(stdlib.itertools.GetSortedKeys(value)) do
			local indentation = indent:rep(indentLevel+1)
			local otherValue = stdlib.repr(value[k], indentLevel+1)

			table.insert(output, ("%s %s = %s\n"):format(indentation, k, otherValue))
        end

        table.insert(output, ("%s}"):format(indent:rep(indentLevel)))
    elseif typeof(value) == "string" then
		table.insert(output, ("%q (string)"):format(value))
    else
		table.insert(output, ("%s (%s)"):format(tostring(value), typeof(value)))
    end

    return table.concat(output)
end


return stdlib