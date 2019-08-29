local defaultAnimationIdsR15 = {
    idle = {
        { id = "507766666", weight = 1 },
        { id = "507766951", weight = 1 },
        { id = "507766388", weight = 9 }
    },
    walk = { { id = "507777826", weight = 10 } },
    run = 	{
        { id = "507767714", weight = 10 } 
    }, 
    swim = 	{
        { id = "507784897", weight = 10 } 
    }, 
    swimidle = 	{
        { id = "507785072", weight = 10 } 
    }, 
    jump = 	{
        { id = "507765000", weight = 10 } 
    }, 
    fall = 	{
        { id = "507767968", weight = 10 } 
    }, 
    climb = {
        { id = "507765644", weight = 10 } 
    }, 
    sit = 	{
        { id = "2506281703", weight = 10 } 
    },	
    toolnone = {
        { id = "507768375", weight = 10 } 
    },
    toolslash = {
        { id = "522635514", weight = 10 }
    },
    toollunge = {
        { id = "522638767", weight = 10 }
    },
    wave = {
        { id = "507770239", weight = 10 }
    },
    point = {
        { id = "507770453", weight = 10 }
    },
    dance = {
        { id = "507771019", weight = 10 },
        { id = "507771955", weight = 10 },
        { id = "507772104", weight = 10 }
    },
    dance2 = {
        { id = "507776043", weight = 10 },
        { id = "507776720", weight = 10 },
        { id = "507776879", weight = 10 }
    },
    dance3 = {
        { id = "507777268", weight = 10 },
        { id = "507777451", weight = 10 },
        { id = "507777623", weight = 10 }
    },
    laugh = {
        { id = "507770818", weight = 10 }
    },
    cheer = {
        { id = "507770677", weight = 10 }
    }
}

local defaultAnimationIdsR6 = {
    idle = 	{
        { id = "180435571", weight = 9 },
        { id = "180435792", weight = 1 }
    },
    walk = 	{
        { id = "180426354", weight = 10 } 
    }, 
    run = 	{
        { id = "run.xml", weight = 10 } 
    }, 
    jump = 	{
        { id = "125750702", weight = 10 } 
    }, 
    fall = 	{
        { id = "180436148", weight = 10 } 
    }, 
    climb = {
        { id = "180436334", weight = 10 } 
    }, 
    sit = {
        { id = "178130996", weight = 10 } 
    },	
    toolnone = {
        { id = "182393478", weight = 10 } 
    },
    toolslash = {
        { id = "129967390", weight = 10 } 
--				{ id = "slash.xml", weight = 10 } 
    },
    toollunge = {
        { id = "129967478", weight = 10 } 
    },
    wave = {
        { id = "128777973", weight = 10 } 
    },
    point = {
        { id = "128853357", weight = 10 } 
    },
    dance1 = {
        { id = "182435998", weight = 10 }, 
        { id = "182491037", weight = 10 }, 
        { id = "182491065", weight = 10 } 
    },
    dance2 = {
        { id = "182436842", weight = 10 }, 
        { id = "182491248", weight = 10 }, 
        { id = "182491277", weight = 10 } 
    },
    dance3 = {
        { id = "182436935", weight = 10 }, 
        { id = "182491368", weight = 10 }, 
        { id = "182491423", weight = 10 } 
    },
    laugh = {
        { id = "129423131", weight = 10 } 
    },
    cheer = {
        { id = "129423030", weight = 10 } 
    }
}

local module = {
    BaseAssetUrl = "http://www.roblox.com/asset/?id=",
    DefaultAnimationIdsR6 = defaultAnimationIdsR6,
    DefaultAnimationIdsR15 = defaultAnimationIdsR15
}

function module.GetAnimationIdUrlFromAssetId( assetId )
    return module.BaseAssetUrl .. assetId
end

return module