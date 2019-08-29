import { ServerScriptService } from "@rbxts/services";

const scriptFolders = ServerScriptService.GetChildren();
if (scriptFolders !== undefined){
    scriptFolders.forEach(entry => print(entry.Name));
} 

if (ServerScriptService !== undefined) {
    let folders = ServerScriptService.GetDescendants();
    folders.forEach(element => {
        print(element.Name)
    });
}