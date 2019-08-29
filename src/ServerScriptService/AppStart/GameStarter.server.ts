import { ServerScriptService } from "@rbxts/services";
import { Lazarus } from '../Schmeeda/Lazarus';

let luaModule = ServerScriptService.WaitForChild("Schmeeda").WaitForChild("SchmeedaModule") as ModuleScript;

const stephanie = require(luaModule) as Lazarus;

let thousandsOfPictures = stephanie.TakePictures(5);

print("The number of tens of thousands is ", thousandsOfPictures * 10000);

