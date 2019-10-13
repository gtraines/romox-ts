import { Players, LogService } from '@rbxts/services';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { Personage, IPersonage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { ITagService, CollectionIntegration } from '../../ReplicatedStorage/ToughS/ComponentModel/CollectionIntegration';

export interface IPersonageCharacterCollection 
        extends ITagService<Model> {
            
        }
const TagService = requireScript<ITagService<Model>>("Tag")

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
    static _collections : Map<string, IPersonageCharacterCollection>
    static _isInitialized : boolean
    static PersonageTracker : IPersonageCharacterCollection
    static PersonageEntityIdTracker : ITagService<string>
    static PlayerEntityIdTracker : ITagService<string>
    static EntityIdToPlayerIdMapping : Map<string, string>

    static Init() : void {
        if (!this._isInitialized) {
            this.PersonageTracker = new TagService("Personages")
            
            this.EntityIdToPlayerIdMapping = new Map<string, string>()

            this.Personages = new Array<Personage>();
            this.PersonageEntityIdTracker = 
                CollectionIntegration.GetCollectionService<string>("PersonageEntityId")
            
            this._collections = new Map<string, ITagService<Model>>()
            this._CharacterDiedHandlers = new Array<(personage : Personage) => void>()
            this._CharacterJoinedHandlers = new Array<(personage : Personage) => void>()
            this._alwaysAddPlayersToTrackers()
            this._isInitialized = true
        }
    }

    static DestroyAllPlayers() : void {
        let destroyFn = (player : Player) => {
            if (player.Character !== undefined) {
                player.Character.Destroy()
            }
            if (player.FindFirstChild("Backpack") !== undefined) {
                let backpack = player.FindFirstChild("Backpack") as Instance
                if (backpack !== undefined) {
                    let backpackItems = backpack.GetChildren()
                    backpackItems.forEach(item => {
                        item.Destroy()
                    });
                }
            }
        }

        this.PerformOnCurrentPlayers(destroyFn)
    }

    static DestroyAllCharacters() : void {

    }

    static PerformOnCurrentPlayers(fn : (player : Player) => void) : void {
        let currentPlayers = Players.GetPlayers()
        currentPlayers.forEach((player : Player) => {
            fn(player)
        })
    }

    static PerformOnAllCurrentAndFuturePlayers(fn : (player : Player) => void) : void {
        this.PerformOnCurrentPlayers(fn)
        Players.PlayerAdded.Connect(fn)
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
            
            if (playerInstance.Character !== undefined) {
                let personageFromPlayer = new Personage(playerInstance.Character)
                
                print("Character was present for ", playerInstance.Name)
                this.AddPersonageToTrackers(personageFromPlayer, playerInstance.UserId)
            } else {
                print("Character was NOT present for ", playerInstance.Name)
                let charFunc = (addedCharacter : Model) => {
                    print("NOW character is present for ", playerInstance.Name)
                    let personageFromCharacter = new Personage(addedCharacter)
                    this.AddPersonageToTrackers(personageFromCharacter, playerInstance.UserId)
                }
                let buzzerHand = playerInstance.CharacterAdded.Connect(charFunc)
            }

            return true
        }
        
        return false
    }

    static AddPersonageToTrackers(personage : Personage, userId? : number) : void {

        let personageEntityId = personage.EntityId
        
        this.Personages.push(personage)
        
        this.PersonageTracker.add(personage.ModelInstance)

        if (userId !== undefined) {
            this.EntityIdToPlayerIdMapping.set(personageEntityId, tostring(userId))
        }
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

            this.PersonageTracker.remove(foundPersonage.ModelInstance)
            return true
        }

        return false
    }

    static CreateSubCollection(name : string) : IPersonageCharacterCollection {
        if (this._collections.has(name)) {
            return this._collections.get(name) as IPersonageCharacterCollection
        }
        let namedCollection = new TagService(name)
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
            this.PersonageTracker.add(playerPersonage.ModelInstance)
        } else {
            player.CharacterAdded.Connect((character : Model) => {
                let playerPersonage = new Personage(character)
                this.PersonageTracker.add(playerPersonage.ModelInstance)
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
            print("Adding character as Personage: ", character.Name)
            let possiblyPlayer = rq.GetPlayerFromCharacterOrDescendant(character)
            if (possiblyPlayer !== undefined) {
                let player = possiblyPlayer as Player 
                this.AddPlayerAsPersonage(player)
            }       
        }
        this.AddOnCharacterAddedHandler(characterAddedHandler)

        let characterDiedHandler = ( character : Model ) => {
            print( character.Name, " died!")
            let entityId = rq.StringValueOrNil("EntityId", character)
            if (entityId !== undefined) {
                this.RemovePersonageFromTrackers(entityId)
            }

            let possiblyPlayer = rq.GetPlayerFromCharacterOrDescendant(character)
            if (possiblyPlayer !== undefined && 
                possiblyPlayer.Name !== "Workspace" 
                && possiblyPlayer.IsA("Player")) {
                let player = possiblyPlayer as Player
                let foundEntityId = this.GetEntityIdFromPlayerId(player.UserId)
            
                this.RemovePersonageFromTrackers(foundEntityId as string)    
            }
        }
        this.AddOnCharacterDiedHandler(characterDiedHandler)
    }
}