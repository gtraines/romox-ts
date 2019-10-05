--[[
	Thank you for using Zednov's Tycoon Kit!
	This kit has countless options for you to choose from, fear not I have listed them all below
	-Dev Product buttons are here! Require players to purchase a dev product to get the dropper/upgrader/etc.
	-Gamepass buttons are here! Require players to own a gamepass to get a dropper/upgrader/etc.
	-Everything berezaa's  Tyccon kit has! No need to learn a whole new way to build tycoons!
	-Choose how your leaderboard looks! Choose how players play your tycoon!
	-Choose if players can steal other player's loot! (If you allow them to steal loot, add a precent they can steal and the time it takes to cooldown steal time)
	-Choose if there will be multiple currencies! Get creative!
	-We also provide a script which will take any valid tycoon you've built with berezaa's tycoon and transfer it over to be compatiable with ours!
	-We have sounds to give a more fun experience! Change your sounds to your liking!
	
	
	
	Please note that if the tycoon doesn't work, it's probably because you have made a typo in one of the purchase
	buttons or that you made a typo in the object being purchased so like you might've spelt Droper1 instead of Dropper1.
	Test out the tycoon every few buttons you make so you catch the mistake before advancing and having lots of buttons
	to look through.
	
	NOTE:
	If you plan to add devproducts in a game your using this kit in, you will need to edit the current script labeled "DevProductHandler"
	If you have two scripts that handle devproducts, both scripts will not work which is why you will need to merge with the provided one.
	All the settings are in the ModuleScript called 'Settings'
	We have provided a script below to change your berezaa built tycoon into the new improved Zednov Tycoon Kit :)
--]]

--CHANGE THE NAME, COPY ALL BELOW, AND PAST INTO COMMAND BAR

local TycoonName = "INSERT TYCOON NAME HERE"

if game.Workspace:FindFirstChild(TycoonName) then
	local s = nil
	local bTycoon = game.Workspace:FindFirstChild(TycoonName)
	local zTycoon = game.Workspace:FindFirstChild("Zednov's Tycoon Kit")
	local new_Collector = zTycoon['READ ME'].Script:Clone()
	local Gate = zTycoon.Tycoons:GetChildren()[1].Entrance['Touch to claim!'].GateControl:Clone()
	if zTycoon then
		for i,v in pairs(zTycoon.Tycoons:GetChildren()) do --Wipe current tycoon 'demo'
			if v then
				s = v.PurchaseHandler:Clone()
				v:Destroy()
			end
		end
		-- Now make it compatiable
		if s ~= nil then
			for i,v in pairs(bTycoon.Tycoons:GetChildren()) do
				local New_Tycoon = v:Clone()
				New_Tycoon:FindFirstChild('PurchaseHandler'):Destroy()
				s:Clone().Parent = New_Tycoon
				local Team_C = Instance.new('BrickColorValue',New_Tycoon)
				Team_C.Value = BrickColor.new(tostring(v.Name))
				Team_C.Name = "TeamColor"
				New_Tycoon.Name = v.TeamName.Value
				New_Tycoon.Cash.Name = "CurrencyToCollect"
				New_Tycoon.Parent = zTycoon.Tycoons
				New_Tycoon.TeamName:Destroy()
				v:Destroy()
				New_Tycoon.Essentials:FindFirstChild('Cash to collect: $0').NameUpdater:Destroy()
				local n = new_Collector:Clone()
				n.Parent = New_Tycoon.Essentials:FindFirstChild('Cash to collect: $0')
				n.Disabled = false
				New_Tycoon.Gate['Touch to claim ownership!'].GateControl:Destroy()
				local g = Gate:Clone()
				g.Parent = New_Tycoon.Gate['Touch to claim ownership!']
			end
		else
			error("Please don't tamper with script names or this won't work!")
		end
	else
		error("Please don't change the name of our tycoon kit or it won't work!")
	end
	bTycoon:Destroy()
	Gate:Destroy()
	new_Collector:Destroy()
	print('Transfer complete! :)')
else
	error("Check if you spelt the kit's name wrong!")
end