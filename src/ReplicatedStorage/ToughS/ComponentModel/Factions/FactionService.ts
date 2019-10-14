import { FactionLookup } from './FactionsData';
import { FactionIdentifier, FactionIdentifiers } from './FactionDescriptions';
import { IGameEntity, IComponentizedGameEntity, IEntityComponentValue } from '../FundamentalTypes';
import { requireScript } from '../../ScriptLoader';
import { IRquery } from '../../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { CollectionIntegration, IEntityCollection } from '../CollectionIntegration';
import { Personage } from '../../StandardLib/Personage';
import { IFactionable } from './FactionComponent';


const rq = requireScript<IRquery>("rquery")

export class FactionService {
    private static _isInitialized : boolean
    private static _factionCollections : Map<FactionIdentifier, IEntityCollection>

    static Init() : void {
        if (!this._isInitialized) {
            this._factionCollections = 
                new Map<FactionIdentifier, IEntityCollection>() 
            this._initializeFactionCollectionsMap()
        
            this._isInitialized = true
        }
    }

    private static _initializeFactionCollectionsMap() : void {
        let fxns = FactionLookup.GetFactionsAsList()
        for (const fxn of fxns) {
            this._factionCollections.set(
                fxn, 
                CollectionIntegration.GetEntityCollectionService(fxn as string)
            )
        }
    }

    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Init()
            this._isInitialized = true
        }
    }

    static DefaultFaction = FactionIdentifier.Undeclared

    static AssignEntityToSmallestFaction( 
        entity : IComponentizedGameEntity) : FactionIdentifier {
        
        let smallestCount = 999999
        let smallestFaction = this.DefaultFaction
        
        this._factionCollections.forEach(
            (fxnClxn : IEntityCollection, fxnId : FactionIdentifier) => {
            let fxnCount = fxnClxn.getTagged().size()
            if (fxnCount < smallestCount) {
                smallestCount = fxnCount
                smallestFaction = fxnId
            }
        })

        this.AddEntityToFaction(entity, smallestFaction)
        return smallestFaction
    }

    static GetEntityCountForFaction(factionId : FactionIdentifier) : number {
        let fxnClxn = this.GetOrAddFactionCollection(factionId)
        return fxnClxn.getTagged().size()
    }

    static GetOrAddFactionCollection( factionId : FactionIdentifier ) 
        : IEntityCollection {
        this._ensureInitialized()

        let foundCollection : IEntityCollection
        if (!this._factionCollections.has(factionId)) {
            this._factionCollections.set(factionId, 
                CollectionIntegration.GetEntityCollectionService(tostring(factionId)))
        }
        
        foundCollection = this._factionCollections.get(factionId) as IEntityCollection
        
        return foundCollection as IEntityCollection
    }

    static AddPersonageToFaction(personage : Personage, 
        factionId : FactionIdentifier) : void {
        personage.FactionTracker.ClearFactions()
        personage.FactionTracker.AddFaction(factionId)
        this.AddEntityToFactionExclusive(personage, factionId)
    }

    static AddEntityToFaction(entity : IComponentizedGameEntity, 
        factionId : FactionIdentifier) : boolean {
        let entityIdValue = entity.GetEntityIdValue()
        
        let collection = this.GetOrAddFactionCollection(factionId)
        collection.add(entityIdValue)
        return true 
    }

    static AddEntityToFactionExclusive(entity : IComponentizedGameEntity, 
        factionId : FactionIdentifier) : boolean {
        let entityIdValue = entity.GetEntityIdValue()
        
        this._factionCollections.forEach(
            (fxnClxn : IEntityCollection, fxnId : FactionIdentifier) => {
            if (fxnClxn.has(entityIdValue)) {
                this.RemoveEntityFromFaction(entity, fxnId)
            }
        })

        let collection = this.GetOrAddFactionCollection(factionId)
        collection.add(entityIdValue)
        return true 
    }

    static IsEntityInFaction(entity : IComponentizedGameEntity,
        factionId : FactionIdentifier) 
        : boolean {
        let collectionForId = this.GetOrAddFactionCollection(factionId)

        if (collectionForId.has(entity.GetEntityIdValue())) { 
            return true
        }

        return false
    }

    static RemoveEntityFromFaction(entity : IComponentizedGameEntity, factionId : FactionIdentifier) : boolean {
        let entityIdValueToRemove = entity.GetEntityIdValue()
        
        let collection = this.GetOrAddFactionCollection(factionId)
        collection.remove(entityIdValueToRemove)
        return true
    }

    static AreEnemies(entityA : IFactionable, entityB : IFactionable) 
        : boolean {
        
        let entityAFactions = entityA.FactionTracker.Factions
        let entityBFactions = entityB.FactionTracker.Factions

        let areEnemies = false
        
        entityAFactions.forEach((entityAFaction : FactionIdentifier) => {
            entityBFactions.forEach((entityBFaction : FactionIdentifier) => {
                if (FactionLookup.AreFactionsAntagonistic(
                    entityAFaction, 
                    entityBFaction)
                ) {
                    areEnemies = true
                }
            })  
        })

        return areEnemies
    }

    static AreFriends(entityA : IFactionable, entityB : IFactionable) 
        : boolean {
        
        let entityAFactions = entityA.FactionTracker.Factions
        let entityBFactions = entityB.FactionTracker.Factions

        let areFriends = false
        
        entityAFactions.forEach((entityAFaction : FactionIdentifier) => {
            entityBFactions.forEach((entityBFaction : FactionIdentifier) => {
                if (FactionLookup.AreFactionsFriendly(
                        entityAFaction, 
                        entityBFaction)
                ) {
                    areFriends = true
                }
            })
        })

        return areFriends
    }
}