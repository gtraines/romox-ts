import { ServerScriptService, ReplicatedStorage } from "@rbxts/services";
// Run this before the other stuff
const nevermoreModule = ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript;
const nevermoreInitialize = require(nevermoreModule);
// Nevermore initialized, safe to proceed
import { IGameManager } from '../GameModules/GameModulesTypings';
import { SpawnerManager } from '../Spawning/SpawnerManager';

import { IPersonageSpawner } from '../Spawning/SpawnerTypings';
import { IStretcherTool, StretcherTool } from '../../ReplicatedStorage/Equipment/StretcherTool';

import { Spieler } from '../FunctionalDomains/Spieler';
import { ICtfObjectiveManager, CtfObjectiveManager } from '../FunctionalDomains/Transporting/CtfObjectiveManager';
import { Personage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IConfigManager, ConfigManager } from '../Config/ConfigManager';
import { GameJector } from "./GameJector";

const configManager = new ConfigManager(true)
const GameManager = GameJector.GetGameFromConfig(configManager)

Spieler.Init()

const autoSpawnerModule = 
    ServerScriptService.WaitForChild("Spawning").WaitForChild("PersonageSpawner") as ModuleScript;
const AutoSpawner = require(autoSpawnerModule) as IPersonageSpawner


function OneTimeSetup() : void {
    GameManager.Initialize()
    if (configManager.GetFeatureEnabled("UseNpcSpawners")) {
        const spawnerManager = new SpawnerManager();
        spawnerManager.Init();
    }

    let stretcher = game.Workspace.FindFirstChild("RealStretcherTool") as Model
    let theLast = new StretcherTool(stretcher) as IStretcherTool
}

function RunForever() : void {
    while (true) {
        while (!GameManager.GameReady()) {
            GameManager.RunIntermission();
            wait(0.2);
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
