-- -- ROBLOX Services
-- local Players = game.Players
-- local Debris = game.Debris

-- -- Local Variables
-- local Storage
-- local RocketTemplate
-- local Buffer = {}
-- local Tool = script.Parent
-- local Owner = nil
-- local Configurations = Tool.Configuration

-- -- Initialization
-- Storage = Instance.new('Folder', game.Workspace)
-- local StorageFolder = Instance.new('ObjectValue', Tool.Configuration)
-- StorageFolder.Value = Storage
-- StorageFolder.Name = 'StorageFolder'
-- RocketTemplate = script.Rocket
-- RocketTemplate.Parent = nil
-- RocketTemplate.PrimaryPart.BodyForce.force = Vector3.new(0,196.2,0) * (RocketTemplate.PrimaryPart:GetMass() + RocketTemplate.Part:GetMass())

-- -- Local Functions
-- local function CreateRocket()
-- 	local rocketCopy = RocketTemplate:Clone()
-- 	rocketCopy.PrimaryPart.CFrame = CFrame.new(Configurations.StoragePosition.Value)
-- 	rocketCopy.Parent = Storage
-- 	rocketCopy.PrimaryPart:SetNetworkOwner(Owner)
-- 	if(Owner) then
-- 		rocketCopy.PrimaryPart.BrickColor = Owner.TeamColor
-- 	end
	
-- 	table.insert(Buffer, rocketCopy)
-- end

-- local function IntializeBuffer()	
-- 	for i = 1, Configurations.BufferSize.Value do
-- 		CreateRocket()
-- 	end
-- end

-- local function RemoveFromBuffer(rocket)
-- 	for i = 1, #Buffer do
-- 		if Buffer[i] == rocket then
-- 			table.remove(Buffer, i)
-- 			return
-- 		end
-- 	end
-- end

-- local function ResetRocketOwner()
-- 	for _, rocket in ipairs(Buffer) do
-- 		rocket.PrimaryPart:SetNetworkOwner(Owner)
-- 		if(Owner) then
-- 			rocket.PrimaryPart.BrickColor = Owner.TeamColor
-- 		end
-- 	end
-- end

-- local function OnExplosionHit(part, distance)
-- 	local player = Players:GetPlayerFromCharacter(part.Parent) or Players:GetPlayerFromCharacter(part.Parent.Parent)
-- 	if not player then
-- 		if part.Parent.Name ~= 'RocketLauncher' and part.Parent.Name ~= 'Flag' and not part.Anchored then
-- 			local volume = part.Size.X * part.Size.Y * part.Size.Z
-- 			if volume <= Configurations.MaxDestroyVolume.Value then
-- 				if distance < Configurations.BlastRadius.Value * Configurations.DestroyJointRadiusPercent.Value then
-- 					part:BreakJoints()
-- 				end
-- 				if part.Parent.Name == "Rocket" then
-- 					RemoveFromBuffer(part.Parent)
-- 				end
-- 				if #part:GetChildren() == 0 then
-- 					wait(2 * volume)
-- 					part:Destroy()
-- 				end
				
-- 			end
-- 		end
-- 	end
-- end

-- local function OnRocketHit(player, rocket, position)
-- 	local explosion = Instance.new('Explosion', game.Workspace)
-- 	explosion.ExplosionType = Enum.ExplosionType.NoCraters
-- 	explosion.DestroyJointRadiusPercent = 0
-- 	explosion.BlastRadius = Configurations.BlastRadius.Value
-- 	explosion.BlastPressure = Configurations.BlastPressure.Value
-- 	explosion.Position = position
-- 	explosion.Hit:connect(function(part, distance) OnExplosionHit(part, distance, rocket) end)
-- 	rocket.Part.Fire.Enabled = false
-- 	wait(1)
-- 	rocket:Destroy()
-- end

-- local function OnChanged(property)
-- 	if property == 'Parent' then
-- 		if Tool.Parent.Name == 'Backpack' then
-- 			local backpack = Tool.Parent
-- 			Owner = backpack.Parent
-- 		elseif Players:GetPlayerFromCharacter(Tool.Parent) then
-- 			Owner = Players:GetPlayerFromCharacter(Tool.Parent)
-- 		else
-- 			Owner = nil
-- 		end
-- 		ResetRocketOwner()
-- 	end		
-- end

-- local function OnFireRocket(player, rocket)
-- 	rocket.Rocket.Transparency = 0
-- 	rocket.Part.Fire.Enabled = true
-- 	CreateRocket()
-- end

-- local function DamagePlayer(hitPlayerId, player, damage)
-- 	local hitPlayer = Players:GetPlayerByUserId(tonumber(hitPlayerId))
-- 	if (hitPlayer.TeamColor == player.TeamColor and Configurations.FriendlyFire.Value) or hitPlayer.TeamColor ~= player.TeamColor then
-- 		local humanoid = hitPlayer.Character:FindFirstChild('Humanoid')
-- 		if humanoid then
-- 			humanoid:TakeDamage(damage)
-- 		end
-- 	end
-- end

-- local function OnHitPlayers(player, hitPlayers)
-- 	for hitPlayerId, _ in pairs(hitPlayers) do
-- 		DamagePlayer(hitPlayerId, player, Configurations.SplashDamage.Value)
-- 	end
-- end

-- local function OnDirectHitPlayer(player, hitPlayerId)
-- 	DamagePlayer(hitPlayerId, player, Configurations.Damage.Value)
-- end

-- -- Event Binding
-- Tool.Changed:connect(OnChanged)
-- Tool.RocketHit.OnServerEvent:connect(OnRocketHit)
-- Tool.FireRocket.OnServerEvent:connect(OnFireRocket)
-- Tool.HitPlayers.OnServerEvent:connect(OnHitPlayers)
-- Tool.DirectHitPlayer.OnServerEvent:connect(OnDirectHitPlayer)

-- IntializeBuffer()