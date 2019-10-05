script.Parent.Head.Touched:connect(function(hit)
	local player = game.Players:GetPlayerFromCharacter(hit.Parent)
	if player ~= nil then
		local PlayerStats = game.ServerStorage.PlayerMoney:FindFirstChild(player.Name)
		if PlayerStats ~= nil then
			local ownstycoon = PlayerStats:FindFirstChild("OwnsTycoon")
			if ownstycoon ~= nil then
				if ownstycoon.Value == nil then
					if script.Parent.Parent.Parent.Owner.Value == nil then
						if hit.Parent:FindFirstChild("Humanoid") then
							if hit.Parent.Humanoid.Health > 0 then
								script.Parent.Parent.Parent.Owner.Value = player
								ownstycoon.Value = script.Parent.Parent.Parent
								script.Parent.Name = player.Name.."'s Tycoon"
								script.Parent.Head.Transparency = 0.6
								script.Parent.Head.CanCollide = false
								player.TeamColor = script.Parent.Parent.Parent.TeamColor.Value
							end
						end
					end
				end
			end
		end
	end
end)