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
