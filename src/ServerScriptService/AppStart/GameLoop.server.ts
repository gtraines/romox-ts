import { ServerScriptService, ReplicatedStorage } from "@rbxts/services";

import { IGameManager } from '../GameModules/GameModules';
import { ISpawnerManager, SpawnerManager } from '../PlayerInterest/SpawnerManager';
import { IAutoSpawner } from '../PlayerInterest/SpawnerTypings';

const nevermoreModule = ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript;
const nevermoreInitialize = require(nevermoreModule);

const autoSpawnerModule = ServerScriptService.WaitForChild("PlayerInterest").WaitForChild("AutoSpawner") as ModuleScript;
const AutoSpawner = require(autoSpawnerModule) as IAutoSpawner;

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
        AutoSpawner.CreateFemaleRunner();
        AutoSpawner.CreateMaleRunner();
        while (!GameManager.RoundOver()) {
            GameManager.Update();
            wait(0.1);
        }
    }
}

OneTimeSetup();
RunForever();
