local stdFolder = script.Parent

local stdLib = {
    itertools = require(stdFolder:WaitForChild("itertools")),
    linq = require(stdFolder:WaitForChild("linq")),
    queue = require(stdFolder:WaitForChild("Queue")),
    randumb = require(stdFolder:WaitForChild("randumb")),
    rquery = require(stdFolder:WaitForChild("rquery")),
	stringobj = require(stdFolder:WaitForChild("stringobj")),
    t = require(stdFolder:WaitForChild("t")),
    uuid = require(stdFolder:WaitForChild("uuid")),
    wraptor = require(stdFolder:WaitForChild("wraptor")),
    into = function(value, into)
	    into.value = value
	    return value
    end
}

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


local bindCheck = stdLib.t.tuple(stdLib.t.table, stdLib.t.callback)

function stdLib.bind(obj, method)
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

stdLib._prettyCheck = stdLib.t.tuple(stdLib.t.any, stdLib.t.optional(stdLib.t.integer))
function stdLib.repr(value, indentLevel)
	assert(stdLib._prettyCheck(value, indentLevel))

    indentLevel = indentLevel or 0

    local output = {}
    local indent = "    "

    if typeof(value) == "table" then
        table.insert(output, "{\n")

        for _, k in pairs(stdLib.itertools.GetSortedKeys(value)) do
			local indentation = indent:rep(indentLevel+1)
			local otherValue = stdLib.repr(value[k], indentLevel+1)

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


return stdLib