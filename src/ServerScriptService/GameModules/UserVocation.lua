local DataStoreService = game:GetService("DataStoreService")
local Teams = game:GetService("Teams")
local UserVocationDataStore = DataStoreService:GetDataStore("UserVocation")
local LibFinder = require(game:GetService("ServerScriptService")
    :WaitForChild("Finders", 1)
    :WaitForChild("LibFinder", 1))

local PubSub = LibFinder:FindLib("pubsub")
local rq = LibFinder:FindLib("rquery")

-- Regen UserId
-- 419193235
-- If you are not editing a place through the Roblox website (for example a local .rbxl file), 
-- you will need to call SetPlaceId() in the Command Bar before an in-Studio game can access a data store.

local VocationIdentifiers = {
    Mayor = 8675309, -- Regen
    CityManager = 9999, -- Me
    
    Undeclared = 1,

    -- Criminals
    Criminal = 20,

    -- Government Employees
    Police = 1100,
    Fire = 1200,
    Medical = 1300,
    Education = 1400,
    CityAdministration = 1500,
    PublicWorks = 1600,
    
    -- Service Industries
    FastFood = 5100,
    PrivateSecurity = 5200,
    Mechanic = 5300,

    Clergy = 8100
}

local module = {
    VocationTopicCategory = nil,
    VocationChangedTopic = nil
}

function module.GetUserVocation(userId)
    local success, currentVocation = pcall(function ()
        return UserVocationDataStore:GetAsync(userId)
    end)

    if success then
        return currentVocation
    end

    -- Check error code, and try again if it failed
    -- Otherwise, add them as undeclared?
end

function module.Init( )
    module.VocationTopicCategory = 
        PubSub.GetOrCreateClientServerTopicCategory( "UserVocation" )
    module.VocationChangedTopic = 
        PubSub.GetOrCreateClientServerTopicInCategory( "UserVocation", "VocationChanged" )
end


function module.ChangeTeam( userId, currentTeam, newTeam )

    module.VocationChangedTopic.OnServerEvent:Connect(function(userId, newTeam, currentTeam)
        if newTeam ~= currentTeam then
            Player.Team = Teams[newTeam]
            Player:LoadCharacter()
        end
    end)
end

function module:SetUserVocation(userId, vocationId)

    local success, err = pcall(function()
        self.UserVocationDataStore:SetAsync(userId, vocationId)
    end)

    if success then
        print("Set vocation for UserId: " .. userId)

    end
end




return module
--[[
    Ordered Data Stores
    
    Regular data stores do not sort their content. 
        This isn’t a concern for many games, but sometimes it’s useful to get data in an ordered fashion, like leaderboard stats.

    An OrderedDataStore is a special type of data store that can:

    - Easily return its content in a sorted order.
    - Return multiple records in one request (versus a regular data store where you can only request one entry at a time).
        
    An ordered data store uses the same functions as a regular data store including:
     GetAsync(), SetAsync(), UpdateAsync(), etc. 
     
     *** In addition, it provides the 
        GetSortedAsync() function which accepts parameters for 
             - the “page size” of the returned DataStorePages object, 
             - the sort order, 
             - and minimum/maximum values.
]]
--[[
    Data Store Events
    Each key in a data store can fire an event when its value changes. 
    This can be connected to a custom function by OnUpdate() which requires 
        the key name of the entry plus the function to call when the event occurs.
    -- Example:
    local connection
 
    local function onLevelUpdate(newLevel)
	    if newLevel == 50 then
		    print("Player has reached max level!")
		    -- Disconnect connection when player reaches max level
		    connection:Disconnect()
	    end
    end
 
    connection = experienceStore:OnUpdate("Player_1234", onLevelUpdate)
 
    local success, err = pcall(function()
	    levelStore:IncrementAsync("Player_1234", 1)
    end)
]]

--[[
    ***************
    Server Limits
    ***************

    Each game server is allowed a certain number of data store requests 
    **** based on the number of players present **(more players means more data will be needed).** 
    Server limits are based on the kind of request being made.

    Request Type	    Methods	            Requests per Minute
    Get	                GetAsync()	        60 + numPlayers × 10
    Set	                SetAsync(),    
                        IncrementAsync(), 
                        UpdateAsync(), 
                        RemoveAsync()	    60 + numPlayers × 10
    Get Sorted	        GetSortedAsync()	5 + numPlayers × 2
    On Update	        OnUpdate()	        30 + numPlayers × 5
    
    Request Type	            Methods	                Cooldown
    Write Requests (same key)	Repeated SetAsync(), 
                                IncrementAsync(), 
                                UpdateAsync(), 
                                or RemoveAsync()	    6 seconds between write requests
    
    You can query the budget of requests on a per-method basis with GetRequestBudgetForRequestType(). 
    See the code samples for a script that displays the present budget for all data store methods.

    ***************
    Data Limits
    ***************
    Along with the frequency of requests, data stores limit how much data can be used per entry. The key, name, and scope must all be under a certain character length, as well as the amount of data stored.

    Component	Maximum Number of Characters
    Key	        50
    Name	    50
    Scope	    50
    Data	    260,000
    
    Since keys, names, and scopes are strings, their length can be checked with string.len(). 
    Data is also saved as a string in data stores, regardless of its initial type. 
    The size of data can be checked with the JSONEncode() function that converts Lua data into a serialized JSON table.

    ***************
    Game Limits
    ***************
    There are also limits on how often an entire game (all of its active servers) can call data stores. 
    *****In particular, requests to a specific key can be throttled if it’s being requested from too many servers at once. 
    In this case, a key is defined by the combination of: 
        a data store’s scope, 
        the store’s name, 
        and the index being requested.

    To avoid exceeding a game’s limits, you should only use data stores in two contexts:

    - Saving player data
    - Managing global configuration values
    
    For player data, requested keys can be unique for each player (UserId is useful for this) so it’s unlikely you’ll hit any global limit.

    For global configurations, if each server is simply reading a value that doesn’t change often, there’s little chance of hitting the threshold.


]]

--[[
    ERROR CODES

    Error Code	Error Message	Notes
101	Key name can't be empty.	Check if the key input into the data store function is an empty string.
102	Key name exceeds the 50 character limit.	Check if the key input into the data store function exceeds a length of 50.
103	X is not allowed in DataStore	An invalid value of type X was returned by a bad update function.
104	Cannot store X in DataStore	A value of type X returned by the update function did not serialize.
105	Serialized value converted byte size exceeds max size 64*1024 bytes.	Character count in string cannot exceed 65,536 characters.
106	MaxValue and MinValue must to be integer	If you're passing a minimum or maximum value to GetSortedAsync() for an OrderedDataStore, both values must be integers.
106	PageSize must be with in a predefined range	The maximum page size for an OrderedDataStore is 100.
301	GetAsync request dropped. Request was throttled, but throttled request queue was full.	GetAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
302	SetAsync request dropped. Request was throttled, but throttled request queue was full.	SetAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
303	IncrementAsync request dropped. Request was throttled, but throttled request queue was full.	IncrementAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
304	UpdateAsync request dropped. Request was throttled, but throttled request queue was full.	UpdateAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
305	GetSorted request dropped. Request was throttled, but throttled request queue was full.	GetSortedAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
306	RemoveAsync request dropped. Request was throttled, but throttled request queue was full.	RemoveAsync() request has exceeded the maximum queue size and Roblox is unable to process the requests at the current throughput.
401	Request Failed. DataModel Inaccessible when game shutting down.	DataModel is uninitialized because game is shutting down.
402	Request Failed. LuaWebService Inaccessible when game shutting down.	LuaWebService is uninitialized because game is shutting down.
403	Cannot write to DataStore from studio if API access is not enabled.	API access must be active in order to use data stores in Studio. See the data stores article for instructions.
404	OrderedDataStore does not exists.	The OrderedDataStore associated with this request has been removed.
501	Can't parse response, data may be corrupted.	System is unable to parse value from response. Data may be corrupted.
502	API Services rejected request with error: X.	Error X occurred when processing on Roblox servers. Depending on the response, you may want to retry the request at a later time.
503	DataStore Request successful, but key not found.	The key requested was not found in the data store. Ensure the data for the key is set first, then try again.
504	Datastore Request successful, but response not formatted correctly.	Data retrieved from GlobalDataStore was malformed. Data may be corrupted.
505	OrderedDatastore Request successful, but response not formatted correctly.	Data retrieved from OrderedDataStore was malformed. Data may be corrupted.
]]