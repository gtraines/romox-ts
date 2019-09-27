import { Workspace } from '@rbxts/services';
import { ITransportableArtifact } from './TransportableArtifact';
import { CtfFlagArtifact } from './CtfFlagArtifact';
import { ITransportObjective, TransportObjective } from "./TransportObjective";
import { ITransportObjectiveManager, TransportObjectiveManager } from './TransportObjectiveManager';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IPubSub } from '../../Nevermore/Shared/Events/PubSubTypings';
import { Spieler } from '../Spieler';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';

const rq = requireScript<IRquery>("rquery")
const pubSub = requireScript<IPubSub>("PubSub")

export interface ICtfObjectiveManager extends ITransportObjectiveManager {

}

export class CtfObjectiveManager extends TransportObjectiveManager implements ICtfObjectiveManager {

    constructor(gameConfig: Array<any>) {
        super("Ctf")
        this.GameConfig = gameConfig;
        let folder = pubSub.GetOrCreateClientServerTopicCategory("Ctf");
        this.ReturnArtifact = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", "ReturnArtifact");
        this.ReturnArtifact.OnServerEvent.Connect(() => {

        });

        this.CompletedTransport = pubSub.GetOrCreateClientServerTopicInCategory("Ctf", "CompletedTransport");
        
    }
    GameConfig: any[];
    ReturnArtifact: RemoteEvent;
    CompletedTransport: RemoteEvent;
    
    GetOnCompletedTransportHandler() {
        let handler = (player: Player, ...data: any[]) => {
            
        };
        return handler;
    }
    GetArtifactDroppedCallback(): (artifact: ITransportableArtifact) => void {
        //
        let cb = (artifact : ITransportableArtifact) => {
            print("Dropped artifact: ", artifact.ModelInstance.Name)
        }
        return cb
    }
    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void {
        let cb = (artifact: ITransportableArtifact, player: Player) => {
            
            print(artifact.ModelInstance.Name, " was picked up by ", player.Name)
            let playerEntityId = Spieler.GetEntityIdFromPlayerId(player.UserId)
            if (playerEntityId !== undefined) {
                this.AddTransporterToTrackedTransporters(playerEntityId, artifact)
            }
        }
        return cb;
    }
    GetCharacterTouchedObjectiveCallback(): 
        (character: Model, objective: ITransportObjective) => void {
        let cb = (character: Model, objective: ITransportObjective) => {
            print(character.Name, " touched ", objective.ModelInstance.Name)
            let entityId = rq.GetOrAddEntityId(character)
            let carryingArtifact = this.TransporterPersonages.has(entityId)
            if (carryingArtifact) {
                print("Carrying artifact!")
                this.RemoveTransporterFromTrackedTransporters(entityId)
            }
        }
        return cb;
    }
    CreateArtifact(model: Model): ITransportableArtifact {
        let artifact = new CtfFlagArtifact(model)
        return artifact
    }
    GatherTransportableArtifactModels(): Model[] {
        let objectiveItemsFolder = Workspace.FindFirstChild("ObjectiveItems") as Folder;
        let ctfItems = objectiveItemsFolder.FindFirstChild("Flags") as Folder;
        let transportableModelsFolder = ctfItems.FindFirstChild("Artifacts") as Folder;
        let folderContents = transportableModelsFolder.GetChildren();
        let transportableModels = new Array<Model>()
        transportableModels = folderContents.filter(
            candidate => { return (candidate.Name === "Flag" && candidate.IsA("Model")) }
            ).map(
                instance => instance as Model)
        return transportableModels
    }
    CreateObjective(model: Model): ITransportObjective {
        return new TransportObjective(model)
    }
    GatherTransportObjectiveModels(): Model[] {
        let objectiveItemsFolder = Workspace.FindFirstChild("ObjectiveItems") as Folder;
        let ctfItems = objectiveItemsFolder.FindFirstChild("Flags") as Folder;
        let objectiveModels = ctfItems.GetChildren().filter((instance : Instance, idx : number) => {
            return (instance.Name === "FlagStand" && instance.IsA("Model"))
        }).map(instance => instance as Model)
        return objectiveModels
    }
}
