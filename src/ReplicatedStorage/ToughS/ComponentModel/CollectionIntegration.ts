
import { CollectionService } from "@rbxts/services"


export interface ICollectionIntegration {

}

export class CollectionIntegration {
    constructor(tagName : string) {
        let so = CollectionService.GetInstanceAddedSignal(tagName)
    }
}