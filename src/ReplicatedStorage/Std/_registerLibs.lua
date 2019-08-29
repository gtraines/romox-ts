local ReplicatedStorage = game:GetService("ReplicatedStorage")

local stdFolder = ReplicatedStorage:WaitForChild("Std", 1)

local stdLibs = {
    itertools = require(stdFolder:WaitForChild("itertools")),
    linq = require(stdFolder:WaitForChild("linq")),
    queue = require(stdFolder:WaitForChild("Queue")),
	randumb = require(stdFolder:WaitForChild("randumb")),
	stringobj = require(stdFolder:WaitForChild("stringobj")),
    t = require(stdFolder:WaitForChild("t")),
    uuid = require(stdFolder:WaitForChild("uuid")),
    wraptor = require(stdFolder:WaitForChild("wraptor"))
}

return stdLibs
