import { ReplicatedStorage } from '@rbxts/services';
const nvrmoreModule = ReplicatedStorage.WaitForChild("Nevermore") as ModuleScript
const nvrmoreFunc = require(nvrmoreModule) as (moduleName : string) => any

export function requireScript<T>(moduleName:string) : T {
    let foundModule = nvrmoreFunc(moduleName) as T
    return foundModule
}