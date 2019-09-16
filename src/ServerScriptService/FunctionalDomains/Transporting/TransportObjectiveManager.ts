import { IPersonage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { ITransportableArtifact } from './TransportableArtifact';
import { ITransportObjective, TransportObjective } from './TransportObjective';

export interface ITransportObjectiveManager {
    GameConfig: Array<any>;
    TransportableArtifacts: Array<ITransportableArtifact>;
    TransportObjectives: Array<ITransportObjective>;
    TransporterPersonages: Array<IPersonage>;
    CompletedTransport: RemoteEvent;
    ReturnArtifact: RemoteEvent;
    GenerateAndRegisterArtifacts() : void
    GenerateAndRegisterObjectives() : void
    GatherTransportableArtifactModels() : Array<Model>
    GatherTransportObjectiveModels() : Array<Model>
    AttachCallbacksToArtifact(artifact : ITransportableArtifact) : ITransportableArtifact
    AttachCallbacksToObjective(objective : ITransportObjective) : ITransportObjective
    CreateArtifact(model : Model) : ITransportableArtifact
    CreateObjective(model : Model) : ITransportObjective
    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void;
    GetArtifactDroppedCallback(): (artifact: ITransportableArtifact) => void;
    GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void;
}

export abstract class TransportObjectiveManager implements ITransportObjectiveManager {
    constructor() {
        this.TransportableArtifacts = new Array<ITransportableArtifact>()
        this.TransportObjectives = new Array<ITransportObjective>()
        this.TransporterPersonages = new Array<IPersonage>()

    }
    abstract GameConfig: any[];
    TransportableArtifacts: ITransportableArtifact[];
    TransportObjectives: ITransportObjective[];
    TransporterPersonages: IPersonage[];
    abstract CompletedTransport: RemoteEvent;
    abstract ReturnArtifact: RemoteEvent;
    GenerateAndRegisterArtifacts() : void {
        let models = this.GatherTransportableArtifactModels()
        models.forEach(model => {
            let createdArtifact = this.CreateArtifact(model)
            createdArtifact = this.AttachCallbacksToArtifact(createdArtifact)
            this.TransportableArtifacts.push(createdArtifact)
        })
    }
    GenerateAndRegisterObjectives() : void {
        let models = this.GatherTransportObjectiveModels()
        models.forEach(model => {
            let createdObjective = this.CreateObjective(model)
            createdObjective = this.AttachCallbacksToObjective(createdObjective)
            this.TransportObjectives.push(createdObjective)
        })
    }
    abstract GatherTransportableArtifactModels() : Array<Model>
    abstract GatherTransportObjectiveModels() : Array<Model>
    AttachCallbacksToArtifact(artifact : ITransportableArtifact) : ITransportableArtifact {
        artifact.ArtifactPickedUpCallback = this.GetArtifactPickedUpCallback()
        artifact.ArtifactDroppedCallback = this.GetArtifactDroppedCallback()
        artifact.TouchedObjectiveCallback = this.GetTouchedObjectiveCallback()
        return artifact
    }
    AttachCallbacksToObjective(objective : ITransportObjective) : ITransportObjective {
        objective.ArtifactTouchedObjectiveCallback = this.GetTouchedObjectiveCallback()
        return objective
    }
    abstract CreateArtifact(model : Model) : ITransportableArtifact
    abstract CreateObjective(model : Model) : ITransportObjective
    abstract GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void 
    abstract GetArtifactDroppedCallback(): (artifact: ITransportableArtifact) => void
    abstract GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void
}