import { ReplicatedStorage, ServerStorage, CollectionService } from "@rbxts/services"
import { requireScript } from '../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../Nevermore/Shared/StandardLib/StdLibTypings';
import { IGameModel, GameModel } from '../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IKeyValuePair } from "ServerScriptService/Nevermore/Shared/rodash/RodashTypings";
import { IStateMachineState } from "ServerScriptService/Nevermore/Shared/StateMachine/StateMachineTypings";
import { IPersonage, Personage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { IPubSub } from '../Nevermore/Shared/Events/PubSubTypings';

const rq = requireScript("rquery") as IRquery
const pubSub = requireScript("PubSub") as IPubSub

export enum TransportableArtifactState {
    AtSpawn = 0,
    PickedUp = 1
}

export interface ITransportObjective extends IGameModel {
    WireUpHandlers() : Array<RBXScriptConnection>
    GetOnPickedUpHandler() : (player : Player) => void
    GetOnCarrierDiedHandler() : (player : Player) => void

    DestroyObjective() : void
}

export interface ITransportableArtifact extends IGameModel {

    WireUpHandlers() : Array<IKeyValuePair<string, RBXScriptConnection>>
    GetOnPickedUpHandler() : (player : Player) => void
    GetOnCarrierDiedHandler() : (player : Player) => void
    GetOnTouchedHandler() : (otherPart : BasePart) => void
    PickupArtifact(player : Player) : void
    State : TransportableArtifactState
    TouchedEventConnection? : RBXScriptConnection
    PickedUpEventConnection? : RBXScriptConnection
    CarrierDiedEventConnection? : RBXScriptConnection
    Destroy() : void
}

export interface ICtfFlagArtifact extends ITransportableArtifact {
    FlagPole : Part
    FlagBanner : Part
}

export class CtfFlagArtifact extends GameModel implements ICtfFlagArtifact {
    constructor(gameModel : Model) {
        super(gameModel)
        this.WireUpHandlers()
        this.State = TransportableArtifactState.AtSpawn
        this.FlagBanner = gameModel.FindFirstChild("FlagBanner") as Part
        this.FlagPole = gameModel.FindFirstChild("FlagPole") as Part
    }
    WireUpHandlers(): IKeyValuePair<string, RBXScriptConnection>[] {
        let createdConnections = new Array<IKeyValuePair<string, RBXScriptConnection>>()
        this.TouchedEventConnection = this.FlagPole.Touched.Connect(this.GetOnTouchedHandler())
        return createdConnections
    }
    GetOnPickedUpHandler() : (player : Player) => void {
        let handler = (player : Player) => {

        }
        return handler;
    }
    GetOnCarrierDiedHandler() : (player : Player) => void {
        let handler = (player : Player) => {
            // local flagObject = FlagCarriers[player]

        }
        return handler;
    }
    GetOnTouchedHandler() : (otherPart : BasePart) => void {
        let handler = (otherPart : BasePart) => {
            let touchingPersonage = rq.AttachedCharacterOrNil(otherPart as Part)
            let foundPlayer = rq.GetPlayerFromCharacterOrDescendant(touchingPersonage)
            if (foundPlayer !== undefined) {
                let foundHumanoid = rq.GetPersonageOrPlayerHumanoidOrNil(touchingPersonage)
                if (foundHumanoid.Health <= 0) return;
                if (this.FlagBanner.BrickColor !== foundPlayer.TeamColor && this.State !== TransportableArtifactState.PickedUp) {
                    this.PickupArtifact(foundPlayer)
                }
            }
        }
        return handler;
    }
    PickupArtifact(player : Player) {
        // FlagCarriers[player] = flagModel
        this.State = TransportableArtifactState.PickedUp
        let torso = rq.PersonageTorsoOrEquivalent(player.Character as Model)

        this.FlagPole.Anchored = false
        this.FlagBanner.Anchored = false
        this.FlagPole.CanCollide = false
        this.FlagBanner.CanCollide = false

        let weld = new Instance("Weld", this.FlagPole)
        weld.Name = "PlayerFlagWeld"
        weld.Part0 = this.FlagPole
        weld.Part1 = torso
        weld.C0 = new CFrame(0, 0, -1)

        // Attach event handlers to player
        // OnBaseTouched -- remove handler
    }
    State: TransportableArtifactState;
    FlagPole : Part
    FlagBanner : Part
    TouchedEventConnection?: RBXScriptConnection | undefined;
    PickedUpEventConnection?: RBXScriptConnection | undefined;
    CarrierDiedEventConnection?: RBXScriptConnection | undefined;
    Destroy(): void {
        throw "Method not implemented.";
    }
}

export class CtfFlagObjective extends GameModel implements ITransportObjective {
    constructor(gameModel : Model) {
        super(gameModel)
    }
    WireUpHandlers(): RBXScriptConnection[] {
        throw "Method not implemented.";
    }
    GetOnPickedUpHandler() {
        let handler = (player : Player) => {

        }

        return handler
    }
    GetOnCarrierDiedHandler() {
        let handler = (player : Player) => {

        }
        return handler
    }
    DestroyObjective(): void {
        throw "Method not implemented.";
    }
    
}


export interface ITransportObjectiveManager {
    GameConfig : Array<any>
    TransportableArtifacts : Array<ITransportableArtifact>
    TransporterPersonages : Array<IPersonage>
    CompletedTransport : RemoteEvent
    ReturnArtifact : RemoteEvent
}
export interface ICtfObjectiveManager extends ITransportObjectiveManager {

}

export class CtfObjectiveManager implements ICtfObjectiveManager {
    
    constructor(gameConfig : Array<any>) {
        this.GameConfig = gameConfig
        let folder = pubSub.GetOrCreateClientServerTopicCategory("Ctf")
        // PubSub this.CaptureFlag 
        this.GameConfig = gameConfig

        this.ReturnArtifact = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", 
            "ReturnArtifact")
        this.ReturnArtifact.OnServerEvent.Connect(() => {

         })
        
        this.CompletedTransport = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", 
            "CompletedTransport")
        
        this.TransporterPersonages = new Array<IPersonage>()
        this.TransportableArtifacts = new Array<ITransportableArtifact>()
    }
    GameConfig: any[];
    ReturnArtifact: RemoteEvent;
    CompletedTransport : RemoteEvent;
    TransportableArtifacts: ITransportableArtifact[];
    TransporterPersonages: IPersonage[];
    GetOnCompletedTransportHandler() {
        let handler = (player : Player, ...data : any[]) => {

        }

        return handler
    }
}

