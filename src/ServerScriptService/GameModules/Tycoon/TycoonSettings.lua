local module = {
	['Sounds'] = {
		['Purchase'] = 203785492, -- The sound that plays when a player buys a button he can afford
		['Collect'] = 131886985, -- The sound that plays when a player collects his currency
		['ErrorBuy'] = 138090596 -- The sound that plays when a player buys a button he can't afford
	},
	['AutoAssignTeams'] = false, -- If set to false the player will join on a 'hire' team and will pick their own tycoon
	['CurrencyName'] = "Cash", -- The name of your currency inside the tycoons; this will show up everywhere.
	['ButtonsFadeOut'] = true,
	['FadeOutTime'] = 0.5,
	['ButtonsFadeIn'] = true,
	['FadeInTime'] = 0.5,
	['LeaderboardSettings'] = {
		['KOs'] = true, -- KnockOuts will show on the leaderboard
		['KillsName'] = "Kills", -- What will you call the kills
		['WOs'] = true,-- Wipeouts will show on the leaderboard
		['DeathsName'] = "Deaths", -- What will you call the deaths
		['ShowCurrency'] = true, -- Will show player's money to others
		['ShowShortCurrency'] = true -- This will change a players cash from showing "100,000" to "100K"
	},
	['StealSettings'] = {
		['Stealing'] = true, -- If this is set to true, you can step on other player's collectors and steal a precent indeciated below from the player!
		['StealPrecent'] = 0.25, -- This is the precent of their currency you can take! (1 = all of the currency)
		['PlayerProtection'] = 60 -- This is the time in seconds in which the player can not be stolen from
	}
}












function module:ConvertComma(num)
	local x = tostring(num)
	if #x>=10 then
		local important = (#x-9)
		return x:sub(0,(important))..","..x:sub(important+1,important+3)..","..x:sub(important+4,important+6)..","..x:sub(important+7)
	elseif #x>= 7 then
		local important = (#x-6)
		return x:sub(0,(important))..","..x:sub(important+1,important+3)..","..x:sub(important+4)
	elseif #x>=4 then
		return x:sub(0,(#x-3))..","..x:sub((#x-3)+1)
	else
		return num
	end
end

function module:ConvertShort(Filter_Num)
	local x = tostring(Filter_Num)
	if #x>=10 then
		local important = (#x-9)
		return x:sub(0,(important)).."."..(x:sub(#x-7,(#x-7))).."B+"
	elseif #x>= 7 then
		local important = (#x-6)
		return x:sub(0,(important)).."."..(x:sub(#x-5,(#x-5))).."M+"
	elseif #x>=4 then
		return x:sub(0,(#x-3)).."."..(x:sub(#x-2,(#x-2))).."K+"
	else
		return Filter_Num
	end
end

return module
