import { Personage } from "ReplicatedStorage/ToughS/StandardLib/Personage";
import { GameModel } from '../../../ReplicatedStorage/ToughS/ComponentModel/FundamentalTypes';
import { IKeyValuePair, KeyValuePair } from '../../../ReplicatedStorage/ToughS/StandardLib/KeyValuePair';
import { ITransportableArtifact, TransportableArtifactState } from './TransportableArtifact';
import { ITransportObjective } from "./TransportObjective";
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { IPubSub } from '../../Nevermore/Shared/Events/PubSubTypings';
import { Spieler } from '../Spieler';
import { FactionComponent, IFactionComponent } from '../../../ReplicatedStorage/ToughS/ComponentModel/Factions/FactionComponent';


const rq = requireScript("rquery") as IRquery
const pubSub = requireScript("PubSub") as IPubSub


export interface ICtfFlagArtifact extends ITransportableArtifact {
    //OnDroppedCallback : () => void
    FlagPole : Part
    FlagBanner : Part
    
}

export class CtfFlagArtifact extends GameModel implements ICtfFlagArtifact {
    FactionTracker : IFactionComponent = new FactionComponent()
    
    ArtifactAttributes : string[] = [
        "Ctf",
        "Flag"
    ]
    constructor(gameModel: Model, ...factions : string[]) {
        super(gameModel);

        this.FactionTracker = new FactionComponent(...factions)
        if (this.GetComponentStringValue("Factions") !== undefined) {
            this.FactionTracker.LoadFromCommaSeparatedString(
                this.GetComponentStringValue("Factions"))
        }
        
        this.State = TransportableArtifactState.AtSpawn
        this.FlagBanner = gameModel.FindFirstChild("FlagBanner") as Part
        this.FlagPole = gameModel.FindFirstChild("FlagPole") as Part
        this.WireUpHandlers()
    }
    WireUpHandlers(): IKeyValuePair<string, RBXScriptConnection>[] {
        let createdConnections = new Array<IKeyValuePair<string, RBXScriptConnection>>();
        this.LogClass("Wiring up handlers")
        this.TouchedEventConnection = this.FlagPole.Touched.Connect(this.GetOnTouchedHandler());
        this.LogClass("Wired touched event handlers")
        createdConnections.push(new KeyValuePair<string, RBXScriptConnection>("TouchedEventConnection", this.TouchedEventConnection));
        print("WIRED")
        return createdConnections;
    }
    GetOnPickedUpHandler(): (player: Player) => void {
        let handler = (player: Player) => {

        }
        return handler
    }
    GetOnCarrierDiedHandler(): () => void {
        let handler = () => {
            this.FlagBanner.CanCollide = false;
            this.FlagPole.CanCollide = false;
            this.FlagPole.Anchored = true;
            this.FlagBanner.Anchored = true;
            this.State = TransportableArtifactState.Dropped;
            this.SeverConnection();
            this.WireUpHandlers();
        };
        return handler;
    }
    GetOnTouchedHandler(): (otherPart: BasePart) => void {
        print("Getting touched handler")
        let handler = (otherPart: BasePart) => {
            
            let touchingPersonage = rq.AttachedCharacterOrNil(otherPart as Part);
            if (touchingPersonage !== undefined) {
                
                let foundPlayer = rq.GetPlayerFromCharacterOrDescendant(touchingPersonage) 
                if (foundPlayer !== undefined) {
                    
                    let foundHumanoid = rq.GetPersonageOrPlayerHumanoidOrNil(touchingPersonage)
                    if (foundHumanoid.Health <= 0) {
                        this.LogClass("Has NO health")
                        return;
                    }
                    // 
                    let entityId = rq.GetOrAddEntityId(touchingPersonage)
                    let foundPersonage = Spieler.GetPersonageFromEntityId(entityId)
                    if (foundPersonage !== undefined) {                        
                        if (!this.FactionTracker.HasAnyFactionIn( ...foundPersonage.FactionTracker.Factions ) &&
                            this.State !== TransportableArtifactState.PickedUp) {
                            
                                this.PickupArtifact(foundPlayer);
                        }
                    }
                    
                }
            }
        };
        
        return handler;
    }
    PickupArtifact(player: Player) {
        this.LogClass("Picking up")
        this.State = TransportableArtifactState.PickedUp;
        let carryingPersonage = new Personage(player.Character as Model);
        
        this.FlagPole.Anchored = false;
        this.FlagBanner.Anchored = false;
        this.FlagPole.CanCollide = false;
        this.FlagBanner.CanCollide = false;
        let weld = new Instance("Weld", this.FlagPole);
        weld.Name = "PlayerFlagWeld";
        weld.Part0 = this.FlagPole;
        weld.Part1 = carryingPersonage.Torso;
        weld.C0 = new CFrame(0, 0, -1);
        this.CarrierDiedEventConnection =
            carryingPersonage.Humanoid.Died.Connect(this.GetOnCarrierDiedHandler());
        this.CharacterRemovingEventConnection = player.CharacterRemoving.Connect(this.GetOnCarrierDiedHandler());
        
        if (this.ArtifactPickedUpCallback !== undefined) {
            this.ArtifactPickedUpCallback(this, player)
        }
    }
    SeverAllConnections(): void {
        this.SeverConnection(this.CarrierDiedEventConnection);
        this.SeverConnection(this.CharacterRemovingEventConnection);
        this.SeverConnection(this.TouchedEventConnection);
        this.SeverConnection(this.PickedUpEventConnection);
    }
    SeverConnection = (connection?: RBXScriptConnection) => {
        if (connection !== undefined) {
            if (connection.Connected) {
                connection.Disconnect();
            }
            connection = undefined;
        }
    };
    State: TransportableArtifactState;
    
    TransportedBy? : Model
    FlagPole: Part;
    FlagBanner: Part;
    TouchedEventConnection?: RBXScriptConnection | undefined;
    PickedUpEventConnection?: RBXScriptConnection | undefined;
    CarrierDiedEventConnection?: RBXScriptConnection | undefined;
    CharacterRemovingEventConnection?: RBXScriptConnection | undefined;
    ArtifactPickedUpCallback?: (artifact: ITransportableArtifact, player: Player) => void;
    ArtifactDroppedCallback?: (artifact: ITransportableArtifact) => void;
    TouchedObjectiveCallback?: (artifact: ITransportableArtifact, objective: ITransportObjective) => void;
    Destroy(): void {
        this.SeverAllConnections();
        let parts = this.ModelInstance.GetDescendants();
        parts.forEach(element => {
            element.Destroy();
        });
        this.ModelInstance.Parent = undefined;
    }
}
