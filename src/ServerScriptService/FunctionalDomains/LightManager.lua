-- Dictionary
local module = {}

function module.addSurfaceLighting(part, surfaces, range, color)
	-- Type of Face is "NormalId"
	-- Conversions:
	-- Right: 0
	-- Top: 1
	-- Back: 2
	-- Left: 3
	-- Bottom: 4
    -- Front: 5
    
	for _, surface in pairs(surfaces) do
		local lightObj = Instance.new('SurfaceLight', part)
		lightObj.Face = surface
		lightObj.Range = range
		lightObj.Brightness = 3
		lightObj.Color = color
		lightObj.Enabled = true
	end
	
end

return module