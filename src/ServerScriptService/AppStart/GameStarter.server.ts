import { ServerScriptService, ReplicatedStorage } from "@rbxts/services";

import { IGameManager } from '../GameModules/GameModules';
import { ISpawnerManager, SpawnerManager } from '../PlayerInterest/SpawnerManager';

const nevermoreModule = ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript;
const nevermoreInitialize = require(nevermoreModule);

const gameMgrModule = ServerScriptService.WaitForChild("GameModules").WaitForChild("GameManager") as ModuleScript;
const GameManager = require(gameMgrModule) as IGameManager;

function OneTimeSetup() : void {
    const spawnerManager = new SpawnerManager();
    spawnerManager.Init();
}

function RunForever() : void {
    while (true) {
        while (!GameManager.GameReady()) {
            GameManager.RunIntermission();
        }

        GameManager.StopIntermission();
        GameManager.StartRound();

        while (!GameManager.RoundOver()) {
            GameManager.Update();
            wait(0.1);
        }
    }
}

OneTimeSetup();
RunForever();
