local Settings = require(script.Parent.Settings)
local Tycoon = script.Parent.Tycoons:GetChildren()[1]
script.Parent = game.ServerScriptService
local DevProducts = {}
local MarketplaceService = game:GetService('MarketplaceService')

for i,v in pairs(Tycoon:WaitForChild('Buttons'):GetChildren()) do
	if v:FindFirstChild('DevProduct') then
		if v.DevProduct.Value > 0 then
			DevProducts[v.DevProduct.Value] = v -- the button
		end
	end
end

MarketplaceService.ProcessReceipt = function(receiptInfo)
	for i,plr in pairs(game.Players:GetPlayers()) do
		if plr.userId == receiptInfo.PlayerId then
			if DevProducts[receiptInfo.ProductId] then
				local obj = DevProducts[receiptInfo.ProductId]
				local PlrT = game.ServerStorage.PlayerMoney:WaitForChild(plr.Name).OwnsTycoon
				if PlrT.Value ~= nil then
					--if PlrT.Value.PurchasedObjects:FindFirstChild(obj.Object.Value) == false then
						local PlayerStats = game.ServerStorage.PlayerMoney:FindFirstChild(plr.Name)
						Create({[1] = 0,[2] = obj,[3] = PlayerStats}, PlrT.Value.BuyObject)
					--end
				end
			end
		end
	end
end

function Create(tab, prnt)
	local x = Instance.new('Model')
	Instance.new('NumberValue',x).Value = tab[1]
	x.Value.Name = "Cost"
	Instance.new('ObjectValue',x).Value = tab[2]
	x.Value.Name = "Button"
	local Obj = Instance.new('ObjectValue',x)
	Obj.Name = "Stats"
	Obj.Value = tab[3]
	x.Parent = prnt
end