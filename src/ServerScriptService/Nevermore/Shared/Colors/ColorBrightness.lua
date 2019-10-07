
local module = {}

local require = require(game:GetService("ReplicatedStorage"):WaitForChild("Nevermore"))

local t = require("t")

local isBrighterCheck = t.tuple(t.Color3, t.Color3)
local darkenCheck = t.tuple(t.Color3, t.integer)
local brightenCheck = t.tuple(t.Color3, t.integer)
local changeBrightnessCheck = t.tuple(t.Color3, t.integer)

--[[
	Compares two colors to see if one is brighter than the other

	Used for testing to make sure that the colors are actually changing
	brightness.
]]
function module.isBrighter(color1, color2)
    assert(isBrighterCheck(color1, color2))

	local h1, s1, v1 = Color3.toHSV(color1)
	local h2, s2, v2 = Color3.toHSV(color2)
	return (h1 > h2) or (s1 > s2) or (v1 > v2)
end

--[[
	Darkens a color by a percentage. Useful for having one base color in UI and
	modifying another.

	Usage:

		local color = Color3.fromRGB(200, 200, 200)
		local darkerColor = darken(color, 20)
]]
function module.darken(color, percent)
	assert(darkenCheck(color, percent))

    return module.changeBrightness(color, -percent)
end

--[[
	Brightens a color by a percentage. Useful for having one base color in UI and modifying another.

	Usage:

		local color = Color3.fromRGB(200, 200, 200)
		local brighterColor = brighten(color, 20)
]]
function module.brighten(color, percent)
	assert(brightenCheck(color, percent))

    return module.changeBrightness(color, percent)
end


function module.changeBrightness(color, percent)
	assert(changeBrightnessCheck(color, percent))

	local h, s, v = Color3.toHSV(color)

    return Color3.fromHSV(h, s, math.clamp(v+(v*percent/100), 0, 1))
end


return module