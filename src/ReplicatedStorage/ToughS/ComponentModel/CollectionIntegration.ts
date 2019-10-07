import { CollectionService } from "@rbxts/services"
import { requireScript } from '../ScriptLoader';

export interface ITagService<TInstanceType> {
    new(name : string, typecheck? : (instance : Instance) => boolean) : ITagService<TInstanceType>
    name : string
    has(instance : TInstanceType) : boolean
    add(instance : TInstanceType) : void
    remove(instance : TInstanceType) : unknown
    toggle(instance : TInstanceType) : void
    getTagged() : Array<TInstanceType>

    onAdded(callback : (instance : TInstanceType) => void) : RBXScriptConnection
    onRemoved(callback : (instance : TInstanceType) => void) : RBXScriptConnection
}

export interface IEntityCollection extends ITagService<StringValue> {

}

export class CollectionIntegration {

    private static _createdCollections : Map<string, ITagService<any>>
    private static _isInitialized : boolean
    
    static Init() : void {
        if (!this._isInitialized) {
            this._createdCollections = new Map<string, ITagService<any>>()
            this._isInitialized = true
        }
    }

    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Init()
            this._isInitialized = true
        }
    }

    static GetEntityCollectionService(collectionName : string) : ITagService<StringValue> {
        this._ensureInitialized()
        return this.GetCollectionService<StringValue>(collectionName)
    }

    static GetCollectionService<TItem>(collectionName : string) 
        : ITagService<TItem> {
        this._ensureInitialized()

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