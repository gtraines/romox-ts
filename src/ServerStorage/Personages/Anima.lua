local ServerScriptService = game:GetService("ServerScriptService")
local LibFinder = require(ServerScriptService:WaitForChild("Finders"):WaitForChild("LibFinder"))
local uuid = LibFinder:FindLib("uuid")

local animaProto = {
    EntityId = nil,
    Personage = nil,
    Humanoid = nil,
    Pose = nil,
    AnimNames = {},
    AnimTable = {},
    UserSettingResults = {},
    FFlagAnimateScriptEmoteHook = false
}


function animaProto:GetUserSettings()
    local userNoUpdateOnLoopSuccess, userNoUpdateOnLoopValue = pcall(
	    function() 
		    return UserSettings():IsUserFeatureEnabled("UserNoUpdateOnLoop") 
        end)
    
    self.UserSettingResults.userNoUpdateOnLoop = userNoUpdateOnLoopSuccess and userNoUpdateOnLoopValue

    local userAnimationSpeedDampeningSuccess, userAnimationSpeedDampeningValue = pcall(
	    function() 
		    return UserSettings():IsUserFeatureEnabled("UserAnimationSpeedDampening") end)

    self.UserSettingResults.userAnimationSpeedDampening = userAnimationSpeedDampeningSuccess and userAnimationSpeedDampeningValue

    local animateScriptEmoteHookFlagExists, animateScriptEmoteHookFlagEnabled = pcall(function()
	    return UserSettings():IsUserFeatureEnabled("UserAnimateScriptEmoteHook")
    end)

    self.FFlagAnimateScriptEmoteHook = animateScriptEmoteHookFlagExists and animateScriptEmoteHookFlagEnabled

end

local AnimationSpeedDampeningObject = script:FindFirstChild("ScaleDampeningPercent")
local HumanoidHipHeight = 2

local EMOTE_TRANSITION_TIME = 0.1

local currentAnim = ""
local currentAnimInstance = nil
local currentAnimTrack = nil
local currentAnimKeyframeHandler = nil
local currentAnimSpeed = 1.0

local runAnimTrack = nil
local runAnimKeyframeHandler = nil

animaProto.AnimTable = {}
animaProto.AnimNames = { 
	idle = 	{	
				{ id = "http://www.roblox.com/asset/?id=507766666", weight = 1 },
				{ id = "http://www.roblox.com/asset/?id=507766951", weight = 1 },
				{ id = "http://www.roblox.com/asset/?id=507766388", weight = 9 }
			},
	walk = 	{ 	
				{ id = "http://www.roblox.com/asset/?id=507777826", weight = 10 } 
			}, 
	run = 	{
				{ id = "http://www.roblox.com/asset/?id=507767714", weight = 10 } 
			}, 
	swim = 	{
				{ id = "http://www.roblox.com/asset/?id=507784897", weight = 10 } 
			}, 
	swimidle = 	{
				{ id = "http://www.roblox.com/asset/?id=507785072", weight = 10 } 
			}, 
	jump = 	{
				{ id = "http://www.roblox.com/asset/?id=507765000", weight = 10 } 
			}, 
	fall = 	{
				{ id = "http://www.roblox.com/asset/?id=507767968", weight = 10 } 
			}, 
	climb = {
				{ id = "http://www.roblox.com/asset/?id=507765644", weight = 10 } 
			}, 
	sit = 	{
				{ id = "http://www.roblox.com/asset/?id=2506281703", weight = 10 } 
			},	
	toolnone = {
				{ id = "http://www.roblox.com/asset/?id=507768375", weight = 10 } 
			},
	toolslash = {
				{ id = "http://www.roblox.com/asset/?id=522635514", weight = 10 } 
			},
	toollunge = {
				{ id = "http://www.roblox.com/asset/?id=522638767", weight = 10 } 
			},
	wave = {
				{ id = "http://www.roblox.com/asset/?id=507770239", weight = 10 } 
			},
	point = {
				{ id = "http://www.roblox.com/asset/?id=507770453", weight = 10 } 
			},
	dance = {
				{ id = "http://www.roblox.com/asset/?id=507771019", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507771955", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507772104", weight = 10 } 
			},
	dance2 = {
				{ id = "http://www.roblox.com/asset/?id=507776043", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507776720", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507776879", weight = 10 } 
			},
	dance3 = {
				{ id = "http://www.roblox.com/asset/?id=507777268", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507777451", weight = 10 }, 
				{ id = "http://www.roblox.com/asset/?id=507777623", weight = 10 } 
			},
	laugh = {
				{ id = "http://www.roblox.com/asset/?id=507770818", weight = 10 } 
			},
	cheer = {
				{ id = "http://www.roblox.com/asset/?id=507770677", weight = 10 } 
			},
}

-- Existance in this list signifies that it is an emote, the value indicates if it is a looping emote
local emoteNames = { wave = false, point = false, dance = true, dance2 = true, dance3 = true, laugh = false, cheer = false}

local PreloadAnimsUserFlag = false
local PreloadedAnims = {}
local successPreloadAnim, msgPreloadAnim = pcall(function()
	PreloadAnimsUserFlag = UserSettings():IsUserFeatureEnabled("UserPreloadAnimations")
end)
if not successPreloadAnim then
	PreloadAnimsUserFlag = false
end


function animaProto:findExistingAnimationInSet(set, anim)
	if set == nil or anim == nil then
		return 0
	end
	
	for idx = 1, set.count, 1 do 
		if set[idx].anim.AnimationId == anim.AnimationId then
			return idx
		end
	end
	
	return 0
end

function animaProto:ConfigureAnimationSet(name, fileList)
	if (self.AnimTable[name] ~= nil) then
		for _, connection in pairs(self.AnimTable[name].connections) do
			connection:disconnect()
		end
	end
	self.AnimTable[name] = {}
	self.AnimTable[name].count = 0
	self.AnimTable[name].totalWeight = 0	
	self.AnimTable[name].connections = {}

	local allowCustomAnimations = true
	local AllowDisableCustomAnimsUserFlag = false

	local success, msg = pcall(function()
		AllowDisableCustomAnimsUserFlag = UserSettings():IsUserFeatureEnabled("UserAllowDisableCustomAnims2")
	end)

	if (AllowDisableCustomAnimsUserFlag) then
		local success, msg = pcall(
            function()
                allowCustomAnimations = game:GetService("StarterPlayer").AllowCustomAnimations 
            end)
		if not success then
			allowCustomAnimations = true
		end
	end

	-- check for config values
	local config = script:FindFirstChild(name)
	if (allowCustomAnimations and config ~= nil) then
		table.insert(self.AnimTable[name].connections, config.ChildAdded:connect(
            function(child) 
                self:ConfigureAnimationSet(name, fileList) 
            end))
		table.insert(self.AnimTable[name].connections, config.ChildRemoved:connect(
            function(child) 
                self.ConfigureAnimationSet(name, fileList) 
            end))
		
		local idx = 0
		for _, childPart in pairs(config:GetChildren()) do
			if (childPart:IsA("Animation")) then
				local newWeight = 1
				local weightObject = childPart:FindFirstChild("Weight")
				if (weightObject ~= nil) then
					newWeight = weightObject.Value
				end
				self.AnimTable[name].count = self.AnimTable[name].count + 1
				idx = self.AnimTable[name].count
				self.AnimTable[name][idx] = {}
				self.AnimTable[name][idx].anim = childPart
				self.AnimTable[name][idx].weight = newWeight
				self.AnimTable[name].totalWeight = self.AnimTable[name].totalWeight + self.AnimTable[name][idx].weight
				table.insert(self.AnimTable[name].connections, childPart.Changed:connect(
                    function(property) 
                        self:ConfigureAnimationSet(name, fileList) 
                    end))
				table.insert(self.AnimTable[name].connections, childPart.ChildAdded:connect(
                    function(property) 
                        self:ConfigureAnimationSet(name, fileList)
                    end))
				table.insert(self.AnimTable[name].connections, childPart.ChildRemoved:connect(
                    function(property) 
                        self:ConfigureAnimationSet(name, fileList)
                    end))
			end
		end
	end
	
	-- fallback to defaults
	if (self.AnimTable[name].count <= 0) then
		for idx, anim in pairs(fileList) do
			self.AnimTable[name][idx] = {}
			self.AnimTable[name][idx].anim = Instance.new("Animation")
			self.AnimTable[name][idx].anim.Name = name
			self.AnimTable[name][idx].anim.AnimationId = anim.id
			self.AnimTable[name][idx].weight = anim.weight
			self.AnimTable[name].count = self.AnimTable[name].count + 1
			self.AnimTable[name].totalWeight = self.AnimTable[name].totalWeight + anim.weight
		end
	end
	
	-- preload anims
	if PreloadAnimsUserFlag then
		for i, animType in pairs(self.AnimTable) do
			for idx = 1, animType.count, 1 do
				if PreloadedAnims[animType[idx].anim.AnimationId] == nil then
					self.Humanoid:LoadAnimation(animType[idx].anim)
					PreloadedAnims[animType[idx].anim.AnimationId] = true
				end				
			end
		end
	end
end

------------------------------------------------------------------------------------------------------------

function animaProto:ConfigureAnimationSetOld(name, fileList)
	if (self.AnimTable[name] ~= nil) then
		for _, connection in pairs(self.AnimTable[name].connections) do
			connection:disconnect()
		end
	end
	self.AnimTable[name] = {}
	self.AnimTable[name].count = 0
	self.AnimTable[name].totalWeight = 0	
	self.AnimTable[name].connections = {}

	local allowCustomAnimations = true
	local AllowDisableCustomAnimsUserFlag = false

	local success, msg = pcall(function()
		AllowDisableCustomAnimsUserFlag = UserSettings():IsUserFeatureEnabled("UserAllowDisableCustomAnims2")
	end)

	if (AllowDisableCustomAnimsUserFlag) then
		local success, msg = pcall(
            function() 
                allowCustomAnimations = game:GetService("StarterPlayer").AllowCustomAnimations 
            end)
		if not success then
			allowCustomAnimations = true
		end
	end

	-- check for config values
	local config = script:FindFirstChild(name)
	if (allowCustomAnimations and config ~= nil) then
		table.insert(animTable[name].connections, config.ChildAdded:connect(function(child) configureAnimationSet(name, fileList) end))
		table.insert(animTable[name].connections, config.ChildRemoved:connect(function(child) configureAnimationSet(name, fileList) end))
		local idx = 1
		for _, childPart in pairs(config:GetChildren()) do
			if (childPart:IsA("Animation")) then
				table.insert(animTable[name].connections, childPart.Changed:connect(function(property) configureAnimationSet(name, fileList) end))
				animTable[name][idx] = {}
				animTable[name][idx].anim = childPart
				local weightObject = childPart:FindFirstChild("Weight")
				if (weightObject == nil) then
					animTable[name][idx].weight = 1
				else
					animTable[name][idx].weight = weightObject.Value
				end
				animTable[name].count = animTable[name].count + 1
				animTable[name].totalWeight = animTable[name].totalWeight + animTable[name][idx].weight
				idx = idx + 1
			end
		end
	end

	-- fallback to defaults
	if (animTable[name].count <= 0) then
		for idx, anim in pairs(fileList) do
			animTable[name][idx] = {}
			animTable[name][idx].anim = Instance.new("Animation")
			animTable[name][idx].anim.Name = name
			animTable[name][idx].anim.AnimationId = anim.id
			animTable[name][idx].weight = anim.weight
			animTable[name].count = animTable[name].count + 1
			animTable[name].totalWeight = animTable[name].totalWeight + anim.weight
			-- print(name .. " [" .. idx .. "] " .. anim.id .. " (" .. anim.weight .. ")")
		end
	end
	
	-- preload anims
	if PreloadAnimsUserFlag then
		for i, animType in pairs(animTable) do
			for idx = 1, animType.count, 1 do 
				Humanoid:LoadAnimation(animType[idx].anim)
			end
		end
	end
end

-- Setup animation objects
function animaProto:ScriptChildModified(child)
	local fileList = self.AnimNames[child.Name]
	if (fileList ~= nil) then
		self.ConfigureAnimationSet(child.Name, fileList)
	end	
end

function animaProto:ConnectToScriptChildEvents()
    local scriptChildModifiedDelegate = function(child)
        return self:ScriptChildModified(child)
    end

    script.ChildAdded:connect(scriptChildModifiedDelegate)
    script.ChildRemoved:connect(scriptChildModifiedDelegate)
end


for name, fileList in pairs(animNames) do 
	configureAnimationSet(name, fileList)
end	

-- ANIMATION

-- declarations
local toolAnim = "None"
local toolAnimTime = 0

local jumpAnimTime = 0
local jumpAnimDuration = 0.31

local toolTransitionTime = 0.1
local fallTransitionTime = 0.2

local currentlyPlayingEmote = false

-- functions

function stopAllAnimations()
	local oldAnim = currentAnim

	-- return to idle if finishing an emote
	if (emoteNames[oldAnim] ~= nil and emoteNames[oldAnim] == false) then
		oldAnim = "idle"
	end
	
	if FFlagAnimateScriptEmoteHook and currentlyPlayingEmote then
		oldAnim = "idle"
		currentlyPlayingEmote = false
	end

	currentAnim = ""
	currentAnimInstance = nil
	if (currentAnimKeyframeHandler ~= nil) then
		currentAnimKeyframeHandler:disconnect()
	end

	if (currentAnimTrack ~= nil) then
		currentAnimTrack:Stop()
		currentAnimTrack:Destroy()
		currentAnimTrack = nil
	end

	-- clean up walk if there is one
	if (runAnimKeyframeHandler ~= nil) then
		runAnimKeyframeHandler:disconnect()
	end
	
	if (runAnimTrack ~= nil) then
		runAnimTrack:Stop()
		runAnimTrack:Destroy()
		runAnimTrack = nil
	end
	
	return oldAnim
end

function getHeightScale()
	if Humanoid then
		if not Humanoid.AutomaticScalingEnabled then
			return 1
		end
		
		local scale = Humanoid.HipHeight / HumanoidHipHeight
		if userAnimationSpeedDampening then
			if AnimationSpeedDampeningObject == nil then
				AnimationSpeedDampeningObject = script:FindFirstChild("ScaleDampeningPercent")
			end
			if AnimationSpeedDampeningObject ~= nil then
				scale = 1 + (Humanoid.HipHeight - HumanoidHipHeight) * AnimationSpeedDampeningObject.Value / HumanoidHipHeight
			end
		end
		return scale
	end	
	return 1
end

local smallButNotZero = 0.0001
function setRunSpeed(speed)
	local speedScaled = speed * 1.25
	local heightScale = getHeightScale()
	local runSpeed = speedScaled / heightScale

	if runSpeed ~= currentAnimSpeed then
		if runSpeed < 0.33 then
			currentAnimTrack:AdjustWeight(1.0)		
			runAnimTrack:AdjustWeight(smallButNotZero)
		elseif runSpeed < 0.66 then
			local weight = ((runSpeed - 0.33) / 0.33)
			currentAnimTrack:AdjustWeight(1.0 - weight + smallButNotZero)
			runAnimTrack:AdjustWeight(weight + smallButNotZero)
		else
			currentAnimTrack:AdjustWeight(smallButNotZero)
			runAnimTrack:AdjustWeight(1.0)
		end
		currentAnimSpeed = runSpeed
		runAnimTrack:AdjustSpeed(runSpeed)
		currentAnimTrack:AdjustSpeed(runSpeed)
	end	
end

function setAnimationSpeed(speed)
	if currentAnim == "walk" then
			setRunSpeed(speed)
	else
		if speed ~= currentAnimSpeed then
			currentAnimSpeed = speed
			currentAnimTrack:AdjustSpeed(currentAnimSpeed)
		end
	end
end

function keyFrameReachedFunc(frameName)
	if (frameName == "End") then
		if currentAnim == "walk" then
			if userNoUpdateOnLoop == true then
				if runAnimTrack.Looped ~= true then
					runAnimTrack.TimePosition = 0.0
				end
				if currentAnimTrack.Looped ~= true then
					currentAnimTrack.TimePosition = 0.0
				end
			else
				runAnimTrack.TimePosition = 0.0
				currentAnimTrack.TimePosition = 0.0
			end
		else
			local repeatAnim = currentAnim
			-- return to idle if finishing an emote
			if (emoteNames[repeatAnim] ~= nil and emoteNames[repeatAnim] == false) then
				repeatAnim = "idle"
			end
			
			if FFlagAnimateScriptEmoteHook and currentlyPlayingEmote then
				if currentAnimTrack.Looped then
					-- Allow the emote to loop
					return
				end
				
				repeatAnim = "idle"
				currentlyPlayingEmote = false
			end
			
			local animSpeed = currentAnimSpeed
			playAnimation(repeatAnim, 0.15, Humanoid)
			setAnimationSpeed(animSpeed)
		end
	end
end

function rollAnimation(animName)
	local roll = math.random(1, animTable[animName].totalWeight) 
	local origRoll = roll
	local idx = 1
	while (roll > animTable[animName][idx].weight) do
		roll = roll - animTable[animName][idx].weight
		idx = idx + 1
	end
	return idx
end

local function switchToAnim(anim, animName, transitionTime, humanoid)
	-- switch animation		
	if (anim ~= currentAnimInstance) then
		
		if (currentAnimTrack ~= nil) then
			currentAnimTrack:Stop(transitionTime)
			currentAnimTrack:Destroy()
		end

		if (runAnimTrack ~= nil) then
			runAnimTrack:Stop(transitionTime)
			runAnimTrack:Destroy()
			if userNoUpdateOnLoop == true then
				runAnimTrack = nil
			end
		end

		currentAnimSpeed = 1.0
	
		-- load it to the humanoid; get AnimationTrack
		currentAnimTrack = humanoid:LoadAnimation(anim)
		currentAnimTrack.Priority = Enum.AnimationPriority.Core
		 
		-- play the animation
		currentAnimTrack:Play(transitionTime)
		currentAnim = animName
		currentAnimInstance = anim

		-- set up keyframe name triggers
		if (currentAnimKeyframeHandler ~= nil) then
			currentAnimKeyframeHandler:disconnect()
		end
		currentAnimKeyframeHandler = currentAnimTrack.KeyframeReached:connect(keyFrameReachedFunc)
		
		-- check to see if we need to blend a walk/run animation
		if animName == "walk" then
			local runAnimName = "run"
			local runIdx = rollAnimation(runAnimName)

			runAnimTrack = humanoid:LoadAnimation(animTable[runAnimName][runIdx].anim)
			runAnimTrack.Priority = Enum.AnimationPriority.Core
			runAnimTrack:Play(transitionTime)		
			
			if (runAnimKeyframeHandler ~= nil) then
				runAnimKeyframeHandler:disconnect()
			end
			runAnimKeyframeHandler = runAnimTrack.KeyframeReached:connect(keyFrameReachedFunc)	
		end
	end
end

function playAnimation(animName, transitionTime, humanoid) 	
	local idx = rollAnimation(animName)
	local anim = animTable[animName][idx].anim

	switchToAnim(anim, animName, transitionTime, humanoid)
	currentlyPlayingEmote = false
end

function playEmote(emoteAnim, transitionTime, humanoid)
	switchToAnim(emoteAnim, emoteAnim.Name, transitionTime, humanoid)
	currentlyPlayingEmote = true
end

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

local toolAnimName = ""
local toolAnimTrack = nil
local toolAnimInstance = nil
local currentToolAnimKeyframeHandler = nil

function toolKeyFrameReachedFunc(frameName)
	if (frameName == "End") then
		playToolAnimation(toolAnimName, 0.0, Humanoid)
	end
end


function playToolAnimation(animName, transitionTime, humanoid, priority)	 		
		local idx = rollAnimation(animName)
		local anim = animTable[animName][idx].anim

		if (toolAnimInstance ~= anim) then
			
			if (toolAnimTrack ~= nil) then
				toolAnimTrack:Stop()
				toolAnimTrack:Destroy()
				transitionTime = 0
			end
					
			-- load it to the humanoid; get AnimationTrack
			toolAnimTrack = humanoid:LoadAnimation(anim)
			if priority then
				toolAnimTrack.Priority = priority
			end
			 
			-- play the animation
			toolAnimTrack:Play(transitionTime)
			toolAnimName = animName
			toolAnimInstance = anim

			currentToolAnimKeyframeHandler = toolAnimTrack.KeyframeReached:connect(toolKeyFrameReachedFunc)
		end
end

function stopToolAnimations()
	local oldAnim = toolAnimName

	if (currentToolAnimKeyframeHandler ~= nil) then
		currentToolAnimKeyframeHandler:disconnect()
	end

	toolAnimName = ""
	toolAnimInstance = nil
	if (toolAnimTrack ~= nil) then
		toolAnimTrack:Stop()
		toolAnimTrack:Destroy()
		toolAnimTrack = nil
	end

	return oldAnim
end

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
-- STATE CHANGE HANDLERS

function onRunning(speed)	
	if speed > 0.75 then
		local scale = 16.0
		playAnimation("walk", 0.2, Humanoid)
		setAnimationSpeed(speed / scale)
		pose = "Running"
	else
		if emoteNames[currentAnim] == nil and not currentlyPlayingEmote then
			playAnimation("idle", 0.2, Humanoid)
			pose = "Standing"
		end
	end
end

function onDied()
	pose = "Dead"
end

function onJumping()
	playAnimation("jump", 0.1, Humanoid)
	jumpAnimTime = jumpAnimDuration
	pose = "Jumping"
end

function onClimbing(speed)
	local scale = 5.0
	playAnimation("climb", 0.1, Humanoid)
	setAnimationSpeed(speed / scale)
	pose = "Climbing"
end

function onGettingUp()
	pose = "GettingUp"
end

function onFreeFall()
	if (jumpAnimTime <= 0) then
		playAnimation("fall", fallTransitionTime, Humanoid)
	end
	pose = "FreeFall"
end

function onFallingDown()
	pose = "FallingDown"
end

function onSeated()
	pose = "Seated"
end

function onPlatformStanding()
	pose = "PlatformStanding"
end

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

function onSwimming(speed)
	if speed > 1.00 then
		local scale = 10.0
		playAnimation("swim", 0.4, Humanoid)
		setAnimationSpeed(speed / scale)
		pose = "Swimming"
	else
		playAnimation("swimidle", 0.4, Humanoid)
		pose = "Standing"
	end
end

function animateTool()
	if (toolAnim == "None") then
		playToolAnimation("toolnone", toolTransitionTime, Humanoid, Enum.AnimationPriority.Idle)
		return
	end

	if (toolAnim == "Slash") then
		playToolAnimation("toolslash", 0, Humanoid, Enum.AnimationPriority.Action)
		return
	end

	if (toolAnim == "Lunge") then
		playToolAnimation("toollunge", 0, Humanoid, Enum.AnimationPriority.Action)
		return
	end
end

function getToolAnim(tool)
	for _, c in ipairs(tool:GetChildren()) do
		if c.Name == "toolanim" and c.className == "StringValue" then
			return c
		end
	end
	return nil
end

local lastTick = 0

function animaProto:StepAnimate(currentTime)
	local amplitude = 1
	local frequency = 1
  	local deltaTime = currentTime - lastTick
  	lastTick = currentTime

	local climbFudge = 0
	local setAngles = false

  	if (jumpAnimTime > 0) then
  		jumpAnimTime = jumpAnimTime - deltaTime
  	end

	if (pose == "FreeFall" and jumpAnimTime <= 0) then
		self:PlayAnimation("fall", fallTransitionTime, self.Humanoid)
	elseif (pose == "Seated") then
		self:PlayAnimation("sit", 0.5, self.Humanoid)
		return
	elseif (pose == "Running") then
		self:PlayAnimation("walk", 0.2, self.Humanoid)
    elseif (pose == "Dead" or 
            pose == "GettingUp" or 
            pose == "FallingDown" or 
            pose == "Seated" 
            or pose == "PlatformStanding") then
		self:StopAllAnimations()
		amplitude = 0.1
		frequency = 1
		setAngles = true
	end

	-- Tool Animation handling
	local tool = self.Personage:FindFirstChildOfClass("Tool")
	if tool and tool:FindFirstChild("Handle") then
		local animStringValueObject = self:GetToolAnim(tool)

		if animStringValueObject then
			toolAnim = animStringValueObject.Value
			-- message recieved, delete StringValue
			animStringValueObject.Parent = nil
			toolAnimTime = currentTime + .3
		end

		if currentTime > toolAnimTime then
			toolAnimTime = 0
			toolAnim = "None"
		end

		self:AnimateTool()
	else
		self:StopToolAnimations()
		toolAnim = "None"
		toolAnimInstance = nil
		toolAnimTime = 0
	end
end

function animaProto:ConnectHumanoidEvents()
    -- connect events
    self.Humanoid.Died:connect(onDied)
    self.Humanoid.Running:connect(onRunning)
    self.Humanoid.Jumping:connect(onJumping)
    self.Humanoid.Climbing:connect(onClimbing)
    self.Humanoid.GettingUp:connect(onGettingUp)
    self.Humanoid.FreeFalling:connect(onFreeFall)
    self.Humanoid.FallingDown:connect(onFallingDown)
    self.Humanoid.Seated:connect(onSeated)
    self.Humanoid.PlatformStanding:connect(onPlatformStanding)
    self.Humanoid.Swimming:connect(onSwimming)

    -- emote bindable hook
    if self.FFlagAnimateScriptEmoteHook then
        script:WaitForChild("PlayEmote").OnInvoke = function(emote)
            -- Only play emotes when idling
            if pose ~= "Standing" then
                return
            end
        
            if emoteNames[emote] ~= nil then
                -- Default emotes
                self:PlayAnimation(emote, EMOTE_TRANSITION_TIME, self.Humanoid)
                
                return true
            elseif typeof(emote) == "Instance" and emote:IsA("Animation") then
                -- Non-default emotes
                self:PlayEmote(emote, EMOTE_TRANSITION_TIME, self.Humanoid)
                return true
            end
            
            -- Return false to indicate that the emote could not be played
            return false
        end
    end

end

function animaProto:Init()
    self:ConnectHumanoidEvents()
    -- initialize to idle
    self:PlayAnimation("idle", 0.1, self.Personage)
    self.Pose = "Standing"
    -- loop to handle timed state transitions and tool animations
    while self.Personage.Parent ~= nil do
        local _, currentGameTime = wait(0.1)
        self:StepAnimate(currentGameTime)
    end
end

local animaMeta = { __index = animaProto }

local animaModule = {}

function animaModule.new(personageModel)
    
    math.randomseed(tick())
    local self = setmetatable({}, animaMeta)
    uuid.seed()
	self.EntityId = uuid()
    self.Personage = personageModel
    self.Humanoid = personageModel:WaitForChild("Humanoid")
    self.Pose = "Standing"
    return self
end
