export enum FactionIdentifier {
    AmbientLife = "AmbientLife",
    Education = "Education",
    EmergencyMedical = "EmergencyMedical",
    IncidentActors = "IncidentActors",
    LawEnforcement = "LawEnforcement",
    Maintenance = "Maintenance",
    MalignantActors = "MalignantActors",
    OtherGovernment = "OtherGovernment",
    ParkHosts = "ParkHosts",
    PrivateEnterprise = "PrivateEnterprise",
    PrivateSecurity = "PrivateSecurity",
    Undeclared = "Undeclared",
}

export interface IFactionDescription {
    FactionId : FactionIdentifier
    DisplayName : string
    FriendlyFactions : Array<FactionIdentifier>
    AntagonisticFactions : Array<FactionIdentifier>
}

export class FactionDescription implements IFactionDescription {
    constructor(public FactionId : FactionIdentifier, 
        public DisplayName : string,
        public FriendlyFactions : FactionIdentifier[],
        public AntagonisticFactions: FactionIdentifier[]) {}
}
