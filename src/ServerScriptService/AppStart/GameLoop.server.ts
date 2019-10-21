import { ServerScriptService, ReplicatedStorage } from "@rbxts/services";
// Run this before the other stuff
const nevermoreModule = ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript;
const nevermoreInitialize = require(nevermoreModule);
// Nevermore initialized, safe to proceed
import { TestRunner } from './StartupTests/TestRunner';
import { IGameManager } from '../GameModules/GameModulesTypings';

import { GameJector } from './GameJector';

const GameManager = GameJector.GetDefaultGame() as IGameManager

function PreFlightCheck() : void {
    if (!TestRunner.RunTests()) {
        throw "Failed startup tests"
    }
}

function OneTimeSetup() : void {
    GameManager.Initialize()
    GameManager.BeforeGameStart()
}

function RunForever() : void {
    while (true) {
        while (!GameManager.GameReady()) {
            GameManager.RunIntermission();
            wait(0.2);
        }
        GameManager.BeforeRoundStart()
        GameManager.StopIntermission();
        GameManager.StartRound();
        
        while (!GameManager.RoundOver()) {
            GameManager.Update();
            wait(0.1);
        }

        GameManager.RunIntermission()
        GameManager.RoundCleanup()
    }
}

PreFlightCheck();
OneTimeSetup();
RunForever();
