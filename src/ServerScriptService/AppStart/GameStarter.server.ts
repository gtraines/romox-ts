import { ServerScriptService } from "@rbxts/services";

if (ServerScriptService != undefined) {
    var folders = ServerScriptService.GetDescendants();
    folders.forEach(element => {
        print(element.Name)
    });
}