// Oui, zis is dee place where de factionz are defined
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

export class FactionIdentifiers {
    static FactionMap? : Map<string, FactionIdentifier>
    // I give up, I can't figure out how else to do this
    static GetAsMap() : Map<string, FactionIdentifier> {
        if (this.FactionMap === undefined) {
            this.FactionMap = new Map<string, FactionIdentifier>()

            this.FactionMap.set("AmbientLife", FactionIdentifier.AmbientLife)
            this.FactionMap.set("Education", FactionIdentifier.Education)
            this.FactionMap.set("EmergencyMedical", FactionIdentifier.EmergencyMedical)
            this.FactionMap.set("IncidentActors", FactionIdentifier.IncidentActors)
            this.FactionMap.set("LawEnforcement", FactionIdentifier.LawEnforcement)
            this.FactionMap.set("Maintenance", FactionIdentifier.Maintenance)
            this.FactionMap.set("MalignantActors", FactionIdentifier.MalignantActors)
            this.FactionMap.set("OtherGovernment", FactionIdentifier.OtherGovernment)

            this.FactionMap.set("ParkHosts", FactionIdentifier.ParkHosts)
            this.FactionMap.set("PrivateEnterprise", FactionIdentifier.PrivateEnterprise)
            this.FactionMap.set("PrivateSecurity", FactionIdentifier.PrivateSecurity)
            this.FactionMap.set("Undeclared", FactionIdentifier.Undeclared)

        }
        return this.FactionMap as Map<string, FactionIdentifier>
    }
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
