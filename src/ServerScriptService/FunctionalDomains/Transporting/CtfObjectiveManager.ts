import { Workspace } from '@rbxts/services';
import { IPersonage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { ITransportableArtifact } from './TransportableArtifact';
import { CtfFlagArtifact } from './CtfFlagArtifact';
import { ITransportObjective } from "./TransportObjective";
import { ITransportObjectiveManager } from './TransportObjectiveManager';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IPubSub } from '../../Nevermore/Shared/Events/PubSubTypings';

const pubSub = requireScript("PubSub") as IPubSub

export interface ICtfObjectiveManager extends ITransportObjectiveManager {

}


export class CtfObjectiveManager implements ICtfObjectiveManager {
    constructor(gameConfig: Array<any>) {
        this.GameConfig = gameConfig;
        let folder = pubSub.GetOrCreateClientServerTopicCategory("Ctf");
        this.ReturnArtifact = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", "ReturnArtifact");
        this.ReturnArtifact.OnServerEvent.Connect(() => {
        });
        this.CompletedTransport = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", "CompletedTransport");
        this.TransporterPersonages = new Array<IPersonage>();
        this.TransportableArtifacts = new Array<ITransportableArtifact>();
        this.TransportObjectives = new Array<ITransportObjective>();
    }
    GameConfig: any[];
    ReturnArtifact: RemoteEvent;
    CompletedTransport: RemoteEvent;
    TransportableArtifacts: ITransportableArtifact[];
    TransportObjectives: ITransportObjective[];
    TransporterPersonages: IPersonage[];
    GetOnCompletedTransportHandler() {
        let handler = (player: Player, ...data: any[]) => {
        };
        return handler;
    }
    GatherModels(): void {
        let objectiveItemsFolder = Workspace.FindFirstChild("ObjectiveItems") as Folder;
        let ctfItems = objectiveItemsFolder.FindFirstChild("Flags") as Folder;
        let transportableModelsFolder = ctfItems.FindFirstChild("Artifacts") as Folder;
        let transportableModels = transportableModelsFolder.GetChildren();
        transportableModels.forEach(model => {
            this.TransportableArtifacts.push(new CtfFlagArtifact(model as Model));
        });
    }
    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void {
        let cb = (artifact: ITransportableArtifact, player: Player) => {
        };
        return cb;
    }
    GetDroppedCallback(): (artifact: ITransportableArtifact) => void {
        let cb = (artifact: ITransportableArtifact) => {
        };
        return cb;
    }
    GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void {
        let cb = (artifact: ITransportableArtifact, objective: ITransportObjective) => {
        };
        return cb;
    }
}
