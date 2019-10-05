--//Name Updater

local Module = script.Parent.Parent.Parent.Parent.Parent.Settings
local Modulee = require(Module)
local Name = Modulee.CurrencyName

script.Parent.Name = Name.." : "..script.Parent.Parent.Parent.CurrencyToCollect.Value

script.Parent.Parent.Parent.CurrencyToCollect.Changed:connect(function()
	script.Parent.Name = Name.." : "..script.Parent.Parent.Parent.CurrencyToCollect.Value
end)