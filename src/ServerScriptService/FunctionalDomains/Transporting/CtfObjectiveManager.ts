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
    CreateFlagArtifact(model : Model) : CtfFlagArtifact
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
        this.GatherModels()
    }
    GameConfig: any[];
    ReturnArtifact: RemoteEvent;
    CompletedTransport: RemoteEvent;
    TransportableArtifacts: ITransportableArtifact[];
    TransportObjectives: ITransportObjective[];
    TransporterPersonages: IPersonage[];
    CreateFlagArtifact(model: Model): CtfFlagArtifact {
        let artifact = new CtfFlagArtifact(model)
        artifact.TouchedObjectiveCallback = this.GetTouchedObjectiveCallback()
        artifact.ArtifactPickedUpCallback = this.GetArtifactPickedUpCallback()
        artifact.ItemDroppedCallback = this.GetDroppedCallback()
        return artifact
    }
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
            if (model.Name === "Flag" && model.IsA("Model")) {
                this.TransportableArtifacts.push(this.CreateFlagArtifact(model as Model));
            }
            
        });

        let objectives = ctfItems.GetChildren().filter((instance : Instance, idx : number) => {
            return (instance.Name === "FlagStand" && instance.IsA("Model"))
        })

        objectives.forEach(model => {
            //
            
        });
        
    }

    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void {
        let cb = (artifact: ITransportableArtifact, player: Player) => {
            print(artifact.ModelInstance.Name, " was picked up by ", player.Name)
        };
        return cb;
    }
    GetDroppedCallback(): (artifact: ITransportableArtifact) => void {
        let cb = (artifact: ITransportableArtifact) => {
            print(artifact.ModelInstance.Name, " was dropped ")
        };
        return cb;
    }
    GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void {
        let cb = (artifact: ITransportableArtifact, objective: ITransportObjective) => {
            print(artifact.ModelInstance.Name, " touched ", objective.ModelInstance.Name)
        };
        return cb;
    }
}
