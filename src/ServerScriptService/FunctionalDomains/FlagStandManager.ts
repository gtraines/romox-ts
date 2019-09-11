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
    GetOnTouchedHandler() : (part : Part) => void
    State : string
    TouchedEventConnection? : RBXScriptConnection
    PickedUpEventConnection? : RBXScriptConnection
    CarrierDiedEventConnection? : RBXScriptConnection
    Destroy() : void
}

export class CtfFlagArtifact extends GameModel implements ITransportableArtifact {
    constructor(gameModel : Model) {
        super(gameModel)
        this.WireUpHandlers()
        this.State = "AtSpawn"
    }
    WireUpHandlers(): IKeyValuePair<string, RBXScriptConnection>[] {
        let createdConnections = new Array<IKeyValuePair<string, RBXScriptConnection>>()

        return createdConnections
    }
    GetOnPickedUpHandler() : (player : Player) => void {
        let handler = (player : Player) => {

        }
        return handler;
    }
    GetOnCarrierDiedHandler() : (player : Player) => void {
        let handler = (player : Player) => {

        }
        return handler;
    }
    GetOnTouchedHandler() : (part : Part) => void {
        let handler = (part : Part) => {

        }
        return handler;
    }

    State: string;
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

