local ServerScriptService = game:GetService("ServerScriptService")
local domainsFolder = ServerScriptService:WaitForChild("FunctionalDomains", 1)

local module = {
    CarAndDriver = require(domainsFolder:WaitForChild("CarAndDriver", 2)),
    DisplayManager = require(domainsFolder:WaitForChild("DisplayManager", 2)),
    exNihilo = require(domainsFolder:WaitForChild("ExNihilo")),
    LightManager = require(domainsFolder:WaitForChild("LightManager")),
    MapManager = require(domainsFolder:WaitForChild("MapManager")),
    PlayerManager = require(domainsFolder:WaitForChild("PlayerManager")),
    spieler = require(domainsFolder:WaitForChild("Spieler")),
    TeamManager = require(domainsFolder:WaitForChild("TeamManager")),
    TimeManager = require(domainsFolder:WaitForChild("TimeManager"))
}

return module
