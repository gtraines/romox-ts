--- Main injection point for the game on the client
-- @script ClientMain

local require = require(game:GetService("ReplicatedStorage"):WaitForChild("Nevermore"))

local Players = game:GetService("Players")

local localPlayer = Players.LocalPlayer
local playerGui = localPlayer:WaitForChild("PlayerGui")
local screenGui = playerGui:WaitForChild("ScreenGui")
local snackbarManager = require("SnackbarManager"):Init(screenGui)

	--:WithPlayerGui()

snackbarManager:MakeSnackbar("Client loaded")
print("Client loaded")