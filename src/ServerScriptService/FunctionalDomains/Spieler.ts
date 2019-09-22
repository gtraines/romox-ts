import { Players } from '@rbxts/services';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { ITagService } from '../Nevermore/Shared/ComponentModel/TagTypings';
import { Personage, IPersonage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { CollectionIntegration } from '../../ReplicatedStorage/ToughS/ComponentModel/CollectionIntegration';

export interface IPersonageCollection 
        extends ITagService<Personage> {}
const TagService = requireScript<IPersonageCollection>("Tag")

export class PersonageCollection 
        extends TagService implements IPersonageCollection {}

const rq = requireScript<IRquery>("rquery")

interface IRbxScriptConnection extends RBXScriptConnection {
    IsActive : boolean
}

class RbxScriptConnection implements IRbxScriptConnection {
    constructor() {
        this.IsActive = false
        this.Connected = false
    }
    IsActive: boolean    
    Connected: boolean
    Disconnect(): void {
        warn("Disconnected a placeholder RBXScriptConnection, that was probably not what was intended")
    }
}

export class Spieler {

    static _CharacterJoinedHandlers: Array<(personage : Personage) => void>
    static _CharacterDiedHandlers: Array<(personage : Personage) => void>
    static Personages : Array<Personage>
    static _collections : Map<string, PersonageCollection>
    static _isInitialized : boolean
    static PersonageTracker : PersonageCollection
    static PersonageEntityIdTracker : ITagService<string>
    static PlayerEntityIdTracker : ITagService<string>
    static EntityIdToPlayerIdMapping : Map<string, string>

    static Init() : void {
        if (!this._isInitialized) {
            this.PersonageTracker = new PersonageCollection("Personages")
            
            this.EntityIdToPlayerIdMapping = new Map<string, string>()

            this.Personages = new Array<Personage>();
            this.PersonageEntityIdTracker = 
                CollectionIntegration.GetCollectionService<string>("PersonageEntityId")
            this._collections = new Map<string, ITagService<IPersonage>>()
            this._CharacterDiedHandlers = new Array<(personage : Personage) => void>()
            this._CharacterJoinedHandlers = new Array<(personage : Personage) => void>()
            this._alwaysAddPlayersToTrackers()
            this._isInitialized = true
        }
    }

    static IsEntityIdPlayer(entityId : string) : boolean {
        if (this.EntityIdToPlayerIdMapping.has(entityId)) {
            return true
        }
        return false
    }

    static GetPlayerIdFromEntityId(entityId : string) : string | undefined {
        let foundPlayerId = this.EntityIdToPlayerIdMapping.get(entityId)
        return foundPlayerId
    }

    static GetEntityIdFromPlayerId(playerId : number) : string | undefined {
        let foundEntityId = this.EntityIdToPlayerIdMapping.entries().find(
            kvPair => kvPair[1] === tostring(playerId))
        if (foundEntityId === undefined) {
            return undefined
        }
        return foundEntityId[0]
    }

    static FindPersonageFromPlayer(playerInstance : Player) : Personage {
        let playerId = playerInstance.UserId
        let entityId = this.GetEntityIdFromPlayerId(playerId)

        if (entityId === undefined) {
            this.AddPlayerAsPersonage(playerInstance)
            entityId = this.GetEntityIdFromPlayerId(playerId)
        }

        let foundPersonage = this.GetPersonageFromEntityId(entityId as string)
        return foundPersonage as Personage
    }

    static AddPlayerAsPersonage(playerInstance : Player) : boolean {
        
        let existingPersonageEntityId = this.GetEntityIdFromPlayerId(playerInstance.UserId)

        if (existingPersonageEntityId === undefined) {
            let personageFromPlayer = new Personage(playerInstance.WaitForChild("Character"))

            let personageEntityId = personageFromPlayer.EntityId
            this.EntityIdToPlayerIdMapping.set(personageEntityId, tostring(playerInstance.UserId))
            this.Personages.push(personageFromPlayer)
            this.PersonageTracker.add(personageFromPlayer)

            return true
        }
        
        return false
    }

    static GetPersonageFromEntityId(entityId : string) : Personage | undefined {
        let foundPersonage = this.Personages.find(pers => pers.EntityId === entityId)
        return foundPersonage
    }

    static RemovePersonageFromTrackers(entityId : string) : boolean {
        let foundPersonage = this.GetPersonageFromEntityId(entityId)

        if (foundPersonage !== undefined) {
            this.EntityIdToPlayerIdMapping.delete(entityId as string)
            
            let foundPersonagesIndex = this.Personages.findIndex(( personage : Personage ) => {
                return personage.EntityId === entityId
            })
            this.Personages.remove(foundPersonagesIndex)

            this.PersonageTracker.remove(foundPersonage)
            return true
        }

        return false
    }

    static CreateSubCollection(name : string) : PersonageCollection {
        if (this._collections.has(name)) {
            return this._collections.get(name) as PersonageCollection
        }
        let namedCollection = new PersonageCollection(name)
        this._collections.set(name, namedCollection)
        return namedCollection
    }

    static _addCurrentPlayersToTagSvc() : void {
        let currentPlayers = Players.GetPlayers()

        currentPlayers.forEach((player : Player) => {
            this._addPlayerToPersonageCollection(player)
        })
    }

    static _addPlayerToPersonageCollection(player : Player) : void {
        if (player.Character !== undefined) {
            let playerPersonage = new Personage(player.Character)
            this.Personages.push(playerPersonage)
            this.PersonageTracker.add(playerPersonage)
        } else {
            player.CharacterAdded.Connect((character : Model) => {
                let playerPersonage = new Personage(character)
                this.PersonageTracker.add(playerPersonage)
            })
        }
    }

    static AddOnPlayerJoinedHandler = (handlerFunc: (player: Player) => void) => {
        return Players.PlayerAdded.Connect(handlerFunc)
    }

    static AddOnPlayerLeavingHandler = (handlerFunc: (player: Player) => void) => {
        return Players.PlayerRemoving.Connect(handlerFunc)
    }

    /**
     * @remarks
     * Note that the Humanoid and its body parts (head, torso and limbs) will exist when this event fires, 
     * but clothing items like Hats and Shirts, Pants may take a few seconds to be added to the character 
     * (connect Instance.ChildAdded on the added character to detect these).
     * @param handlerFunc - a function which receives the CHARACTER as an arg when the event fires
     */
    static AddOnCharacterAddedHandler = (handlerFunc: (character: Model) => void) => {
        let rbxConn = new RbxScriptConnection() as RBXScriptConnection
        Spieler.AddOnPlayerJoinedHandler((player : Player) => {
            rbxConn = player.CharacterAdded.Connect(handlerFunc)
        })

        return rbxConn
    }

    static AddOnCharacterDiedHandler = (handlerFunc: (character: Model) => void) => {
        let rbxConn = new RbxScriptConnection() as RBXScriptConnection
        Spieler.AddOnPlayerJoinedHandler((player : Player) => {
            rbxConn = player.CharacterRemoving.Connect(handlerFunc)
        })

        return rbxConn
    }

    static AddPersonageOnDiedHandler(handler : (addedPersonage : Personage) => void) : void {
        // Add to existing

        // Add to future handlers added to collection
    }

    static _alwaysAddPlayersToTrackers() : void {
        let characterAddedHandler = ( character : Model ) => {
            let player = character.Parent as Player
            this.AddPlayerAsPersonage(player)
        }
        this.AddOnCharacterAddedHandler(characterAddedHandler)

        let characterDiedHandler = ( character : Model ) => {
            let player = character.Parent as Player
            let foundEntityId = this.GetEntityIdFromPlayerId(player.UserId)
            
            this.RemovePersonageFromTrackers(foundEntityId as string)
        }
        this.AddOnCharacterDiedHandler(characterDiedHandler)
    }
}