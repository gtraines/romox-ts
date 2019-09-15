import { IPersonage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { ITransportableArtifact } from './TransportableArtifact';
import { ITransportObjective } from "./TransportObjective";

export interface ITransportObjectiveManager {
    GameConfig: Array<any>;
    TransportableArtifacts: Array<ITransportableArtifact>;
    TransportObjectives: Array<ITransportObjective>;
    TransporterPersonages: Array<IPersonage>;
    CompletedTransport: RemoteEvent;
    ReturnArtifact: RemoteEvent;
    GatherModels(): void;
    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void;
    GetDroppedCallback(): (artifact: ITransportableArtifact) => void;
    GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void;
}

export abstract class TransportObjectiveManager implements ITransportObjectiveManager {
    abstract GameConfig: any[];    
    abstract  TransportableArtifacts: ITransportableArtifact[];
    abstract TransportObjectives: ITransportObjective[];
    abstract TransporterPersonages: IPersonage[];
    abstract CompletedTransport: RemoteEvent;
    abstract ReturnArtifact: RemoteEvent;
    GatherModels(): void {
        throw "Method not implemented.";
    }
    GetArtifactPickedUpCallback(): (artifact: ITransportableArtifact, player: Player) => void {
        throw "Method not implemented.";
    }
    GetDroppedCallback(): (artifact: ITransportableArtifact) => void {
        throw "Method not implemented.";
    }
    GetTouchedObjectiveCallback(): (artifact: ITransportableArtifact, objective: ITransportObjective) => void {
        throw "Method not implemented.";
    }
}