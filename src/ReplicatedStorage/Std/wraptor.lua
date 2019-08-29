local ReplicatedStorage = game:GetService("ReplicatedStorage")

local t = require(ReplicatedStorage:WaitForChild("Std"):WaitForChild("t"))

local module = {
    deprecatedWarning = "%s is deprecated. %s"
}

 function module.DEPRECATED(func, funcName, reason)
	warn(module.deprecatedWarning:format(funcName, reason))
	return func
end

function module.TryCatch(funcTry, catch)
	local succ, err = pcall(funcTry)
	
	if not succ then
		return catch(err)
    end
    return succ
end

function module.xpcall(call, handler)
    local succ, err = pcall(call)
    
    if not succ then
        handler(err)
    end
end

--[[
	Calls the given function if it actually exists.

	Useful in Roact components where a callback passed as a prop is optional, so
	you don't always know if you want to run it.

	Usage:

		maybeCall(nil) -- does nothing

		maybeCall(function()
			print("Hello!") -- prints hello
		end)
]]

module._maybeCallCheck = t.union(t.callback, t.none)
function module.MaybeCall(callback, ...)
	assert(module._maybeCallCheck(callback))

	if type(callback) == "function" then
		return callback(...)
	end
end


function module.WithCoolDown( coolDownTime, func )
    local generatedClosure = function(innerCoolDownTime, wrappedFunction)
        local innerCoolDown = innerCoolDownTime
        local canExecute = true

        local innerExecutableFunc = function(...)
            if canExecute then
                wrappedFunction(...)
                canExecute = false
                wait(innerCoolDown)
                canExecute = true
            end

        end

        return innerExecutableFunc

    end

    return generatedClosure(coolDownTime, func)
end

return module