export enum FactionIdentifier {
    EmergencyMedical = "EmergencyMedical",
    LawEnforcement = "LawEnforcement",
    OtherGovernment = "OtherGovernment",
    PrivateEnterprise = "PrivateEnterprise",
    AmbientLife = "AmbientLife",
    MalignantActors = "MalignantActors",
    IncidentActors = "IncidentActors",
    ParkHosts = "ParkHosts"
}


export enum TeamIdentifier {
    

}

export interface ITeamDescription {

}

export interface IFactionDescription {
    FactionId : FactionIdentifier
    DisplayName : string
    AlliedFactions : Array<FactionIdentifier>
    AntagonisticFactions : Array<FactionIdentifier>
}


export class FactionDescription implements IFactionDescription {
    constructor(public FactionId : FactionIdentifier, 
        public DisplayName : string, 
        public AlliedFactions: FactionIdentifier[],
        public FriendlyFactions : FactionIdentifier[],
        public AntagonisticFactions: FactionIdentifier[]) {

        }
}



export class FactionLookup {
    
}