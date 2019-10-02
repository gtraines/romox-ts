import { FactionLookup } from './FactionsData';
import { FactionIdentifier } from './FactionDescriptions';
import { IFactionable } from './Factionable';
import { IGameEntity } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { CollectionIntegration, IEntityCollection } from '../../../ReplicatedStorage/ToughS/ComponentModel/CollectionIntegration';


const rq = requireScript<IRquery>("rquery")

export class FactionService {
    private static _isInitialized : boolean
    private static _factionCollections : Map<FactionIdentifier, IEntityCollection>

    static Init() : void {
        this._factionCollections = 
            new Map<FactionIdentifier, IEntityCollection>() 
            
        this._isInitialized = true
    }

    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Init()
            this._isInitialized = true
        }
    }

    static DefaultFaction = FactionIdentifier.Undeclared

    static AssignEntityToSmallestFaction( entityId : string ) : FactionIdentifier {
        // 
        return this.DefaultFaction
    }

    static GetOrAddFactionCollection( factionId : FactionIdentifier ) : IEntityCollection {
        this._ensureInitialized()

        let foundCollection : IEntityCollection
        if (!this._factionCollections.has(factionId)) {
            this._factionCollections.set(factionId, 
                CollectionIntegration.GetEntityCollectionService(tostring(factionId)))
        }
        
        foundCollection = this._factionCollections.get(factionId) as IEntityCollection
        
        return foundCollection as IEntityCollection
    }

    static AddEntityToFaction(entity : IGameEntity, factionId : FactionIdentifier) : boolean {
        
        let entityIdValue = new Instance("StringValue")
        entityIdValue.Value = entity.EntityId
        
        let collection = this.GetOrAddFactionCollection(factionId)
        collection.add(entityIdValue)
        return true 
    }

    static RemoveEntityFromFaction(entity : IGameEntity, factionId : FactionIdentifier) : boolean {
        
        return true
    }

    static AreEnemies(entityA : IFactionable, entityB : IFactionable) : boolean {
        
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

    static AreFriends(entityA : IFactionable, entityB : IFactionable) : boolean {
        
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