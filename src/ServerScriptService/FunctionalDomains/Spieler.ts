import { Players } from '@rbxts/services';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { ITagService } from '../Nevermore/Shared/ComponentModel/TagTypings';
import { Personage, IPersonage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';

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

    static Init() : void {
        if (!this._isInitialized) {
            this.PersonageTracker = new PersonageCollection("Personages")
            this.Personages = new Array<Personage>();
            this._collections = new Map<string, ITagService<IPersonage>>()
            this._CharacterDiedHandlers = new Array<(personage : Personage) => void>()
            this._CharacterJoinedHandlers = new Array<(personage : Personage) => void>()
            this._isInitialized = true
        }
    }
    static FindPersonageFromPlayer(playerInstance : Player) : Personage {
        let foundPersonage = this.Personages.filter((persItem : Personage) => {
            return persItem.IsPlayer &&  == tostring(playerInstance.UserId) 
        })
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

    static _addHandlersToPersonagesTracker() : void {
        this.PersonageTracker.onAdded( (addedPersonage : Personage) => {
            this._CharacterDiedHandlers.forEach((hndler : () => void) => {

                addedPersonage.Humanoid.Died.Connect(hndler)
            })
        })
    }
}