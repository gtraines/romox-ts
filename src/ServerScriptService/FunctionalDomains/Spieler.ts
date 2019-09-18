import { Players } from '@rbxts/services';
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { ITagService } from '../Nevermore/Shared/ComponentModel/TagTypings';
import { Personage } from '../../ReplicatedStorage/ToughS/StandardLib/Personage';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';

const TagService = requireScript<ITagService<Personage>>("Tag")
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

    static _CharacterJoinedHandlers: Array<(character : Model) => void>
    static _CharacterDiedHandlers: Array<(character : Model) => void>
    static Personages : Array<Personage>
    
    static _isInitialized : boolean
    static TagService : ITagService<Personage>

    static Init() : void {
        if (!this._isInitialized) {
            this.TagService = new TagService("Personage")
            this._CharacterDiedHandlers = new Array<(character : Model) => void>()
            this._CharacterJoinedHandlers = new Array<(character : Model) => void>()
            this._isInitialized = true
        }
    }

    static CreateSubCollection(name : string) : ITagService<Personage> {
        return new TagService("Personage")
    }

    static _addCurrentPlayersToTagSvc() : void {
        let currentPlayers = Players.GetPlayers()

        currentPlayers.forEach((player : Player) => {
            this._addPlayerToTagSvc(player)
        })
    }

    static _addPlayerToTagSvc(player : Player) : void {
        if (player.Character !== undefined) {
            let playerPersonage = new Personage(player.Character)
            this.Personages.push(playerPersonage)
            this.TagService.add(playerPersonage)
        } else {
            player.CharacterAdded.Connect((character : Model) => {
                let playerPersonage = new Personage(character)
                this.TagService.add(playerPersonage)
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

    static _addHandlersToTagSvc() : void {
        
    }
}