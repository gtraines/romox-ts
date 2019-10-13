local ServerScriptService = game:GetService("ServerScriptService")
local domainsFolder = ServerScriptService:WaitForChild("FunctionalDomains", 1)

local module = {
    CarAndDriver = require(domainsFolder:WaitForChild("CarAndDriver", 2)),
    exNihilo = require(domainsFolder:WaitForChild("ExNihilo")),
    LightManager = require(domainsFolder:WaitForChild("LightManager")),
    spieler = require(domainsFolder:WaitForChild("Spieler"))
}

return module
