import { IGameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IKeyValuePair } from '../../../ReplicatedStorage/ToughS/StandardLib/KeyValuePair';
import { ITransportObjective } from "./TransportObjective";
import { IFactionable } from '../../../ReplicatedStorage/ToughS/ComponentModel/FactionTypes';

export enum TransportableArtifactState {
    AtSpawn = 0,
    PickedUp = 1,
    Dropped = 2
}


export interface ITransportableArtifact extends IGameModel {
    ArtifactAttributes : Array<string>
    WireUpHandlers(): Array<IKeyValuePair<string, RBXScriptConnection>>;
    GetOnPickedUpHandler(): (player: Player) => void;
    GetOnCarrierDiedHandler(): () => void;
    GetOnTouchedHandler(): (otherPart: BasePart) => void;
    PickupArtifact(player: Player): void;
    SeverAllConnections(): void;
    SeverConnection: (connection?: RBXScriptConnection) => void;
    State: TransportableArtifactState;
    TouchedEventConnection?: RBXScriptConnection;
    PickedUpEventConnection?: RBXScriptConnection;
    CarrierDiedEventConnection?: RBXScriptConnection;
    CharacterRemovingEventConnection?: RBXScriptConnection;
    Factions : IFactionable
    TransportedBy? : Model
    ArtifactDroppedCallback?: (artifact: ITransportableArtifact) => void;
    ArtifactPickedUpCallback?: (artifact: ITransportableArtifact, player: Player) => void;
    TouchedObjectiveCallback?: (artifact: ITransportableArtifact, objective: ITransportObjective) => void;
    Destroy(): void;
}
