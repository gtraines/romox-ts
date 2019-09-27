import { IPersonage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { ITransportableArtifact } from './TransportableArtifact';
import { ITransportObjective } from './TransportObjective';
import { Spieler } from '../Spieler';

export interface ITransportObjectiveManager {
    GameConfig: Array<any>;
    ManagerName : string
    TransportableArtifacts: Map<string, ITransportableArtifact>
    TransportObjectives: Map<string, ITransportObjective>;
    TransporterPersonages: Map<string, IPersonage>;
    TransportingEntityIdToArtifactEntityIdMap: Map<string, string>
    CompletedTransport: RemoteEvent;
    ReturnArtifact: RemoteEvent;
    AddTransporterToTrackedTransporters(entityId : string, artifact : ITransportableArtifact) : void
    RemoveTransporterFromTrackedTransporters(entityId : string) : void
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
    GetCharacterTouchedObjectiveCallback(): 
        (character : Model, 
            objective: ITransportObjective) => void;
}

export abstract class TransportObjectiveManager implements ITransportObjectiveManager {

    constructor(managerName : string) {
        this.ManagerName = managerName
        this.TransportableArtifacts = new Map<string, ITransportableArtifact>()
        this.TransportObjectives = new Map<string, ITransportObjective>()
        this.TransporterPersonages = new Map<string, IPersonage>()
        this.TransportingEntityIdToArtifactEntityIdMap = new Map<string, string>()
        this.GenerateAndRegisterArtifacts()
        this.GenerateAndRegisterObjectives()
    }
    abstract GameConfig: any[];
    ManagerName : string
    TransportableArtifacts: Map<string, ITransportableArtifact>
    TransportObjectives: Map<string, ITransportObjective>;
    TransporterPersonages: Map<string, IPersonage>
    TransportingEntityIdToArtifactEntityIdMap: Map<string, string>
    abstract CompletedTransport: RemoteEvent;
    abstract ReturnArtifact: RemoteEvent
    AddTransporterToTrackedTransporters(entityId: string, 
        artifact : ITransportableArtifact): 
        void {
        
        this.TransportingEntityIdToArtifactEntityIdMap.set(entityId, 
            artifact.EntityId)
        let personage = Spieler.GetPersonageFromEntityId(entityId)
        if (personage !== undefined) {
            this.TransporterPersonages.set(entityId, personage)
        }
    }
    RemoveTransporterFromTrackedTransporters(entityId: string): void {
        this.TransporterPersonages.delete(entityId)
        this.TransportingEntityIdToArtifactEntityIdMap.delete(entityId)
    }
    GenerateAndRegisterArtifacts() : void {
        let models = this.GatherTransportableArtifactModels()
        models.forEach(model => {
            let createdArtifact = this.CreateArtifact(model)
            createdArtifact = this.AttachCallbacksToArtifact(createdArtifact)
            this.TransportableArtifacts.set(createdArtifact.EntityId, 
                createdArtifact)
        })
    }
    GenerateAndRegisterObjectives() : void {
        let models = this.GatherTransportObjectiveModels()
        models.forEach(model => {
            let createdObjective = this.CreateObjective(model)
            createdObjective = this.AttachCallbacksToObjective(createdObjective)
            this.TransportObjectives.set(createdObjective.EntityId, createdObjective)
        })
    }
    abstract GatherTransportableArtifactModels() : Array<Model>
    abstract GatherTransportObjectiveModels() : Array<Model>
    AttachCallbacksToArtifact(artifact : ITransportableArtifact) : ITransportableArtifact {
        artifact.ArtifactPickedUpCallback = this.GetArtifactPickedUpCallback()
        artifact.ArtifactDroppedCallback = this.GetArtifactDroppedCallback()
        
        return artifact
    }
    AttachCallbacksToObjective(objective : ITransportObjective) : 
        ITransportObjective {
        objective.CharacterTouchedObjectiveCallback = 
            this.GetCharacterTouchedObjectiveCallback()
        return objective
    }
    abstract CreateArtifact(model : Model) : ITransportableArtifact
    abstract CreateObjective(model : Model) : ITransportObjective
    abstract GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void 
    abstract GetArtifactDroppedCallback(): (artifact: ITransportableArtifact) => void
    abstract GetCharacterTouchedObjectiveCallback(): 
        (character: Model, 
            objective: ITransportObjective) => void
}