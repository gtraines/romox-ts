import { CollectionService } from "@rbxts/services"
import { ITagService } from '../../../ServerScriptService/Nevermore/Shared/ComponentModel/TagTypings';
import { requireScript } from '../ScriptLoader';

export interface ICollectionIntegration  {

}

export class CollectionIntegration<TItem> 
    implements ICollectionIntegration {

    static _createdCollections : Map<string, ITagService<any>>
    static _isInitialized : boolean
    static Init() : void {
        if (!this._isInitialized) {
            this._createdCollections = new Map<string, ITagService<any>>()
            this._isInitialized = true
        }
    }

    static GetCollectionService<TItem>(collectionName : string) 
        : ITagService<TItem> {
        this.Init()

        if (this._createdCollections.has(collectionName)) {
            let foundInstance = this._createdCollections.get(collectionName)
            return foundInstance as ITagService<TItem>
        }
        
        let TagService = requireScript<ITagService<TItem>>("Tag")
        
        let createdInstance = new TagService(collectionName)
        this._createdCollections.set(collectionName, createdInstance)

        return createdInstance
    }
}