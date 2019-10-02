import { FactionIdentifier, FactionDescription } from './FactionDescriptions';

const ambient = new FactionDescription(
    FactionIdentifier.AmbientLife,
    "Ambient Life",
    [],
    []
)

const education = new FactionDescription(
    FactionIdentifier.Education,
    "Education",
    [
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.ParkHosts,
        FactionIdentifier.Undeclared
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const emergencyMedical = new FactionDescription(
    FactionIdentifier.EmergencyMedical,
    "Emergency Medical",
    [
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.IncidentActors,
        FactionIdentifier.ParkHosts
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const incidentActors = new FactionDescription(
    FactionIdentifier.IncidentActors,
    "Incident Actors",
    [
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.Maintenance,
        FactionIdentifier.ParkHosts,
        FactionIdentifier.PrivateSecurity
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const lawEnforcement = new FactionDescription(
    FactionIdentifier.LawEnforcement,
    "Law Enforcement",
    [
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.PrivateSecurity,
        FactionIdentifier.IncidentActors,
        FactionIdentifier.ParkHosts
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const maintenance = new FactionDescription(
    FactionIdentifier.Maintenance,
    "Maintenance",
    [],
    []
)

const malignantActors = new FactionDescription(
    FactionIdentifier.MalignantActors,
    "Malignant Actors",
    [],
    [
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.PrivateSecurity,
        FactionIdentifier.PrivateEnterprise,
        FactionIdentifier.IncidentActors
    ]
)

const otherGovt = new FactionDescription(
    FactionIdentifier.OtherGovernment,
    "Government Agencies",
    [
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.Education,
        FactionIdentifier.IncidentActors,
        FactionIdentifier.ParkHosts,
        FactionIdentifier.Maintenance
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const parkHosts = new FactionDescription(
    FactionIdentifier.ParkHosts,
    "Park Hosts",
    [],
    []
)

const privateEnterprise = new FactionDescription(
    FactionIdentifier.PrivateEnterprise,
    "Private Enterprise",
    [
        FactionIdentifier.Undeclared,
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.Maintenance,
        FactionIdentifier.IncidentActors,
        FactionIdentifier.ParkHosts,
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const privateSecurity = new FactionDescription(
    FactionIdentifier.PrivateSecurity,
    "Private Security",
    [
        FactionIdentifier.LawEnforcement,
        FactionIdentifier.EmergencyMedical,
        FactionIdentifier.OtherGovernment,
    ],
    [
        FactionIdentifier.MalignantActors
    ]
)

const undeclared = new FactionDescription(
    FactionIdentifier.Undeclared,
    "Undeclared",
    [
        FactionIdentifier.ParkHosts,
        FactionIdentifier.OtherGovernment,
        FactionIdentifier.PrivateEnterprise,
        FactionIdentifier.Education
    ],
    []
)

export class FactionLookup {
    private static _isInitialized : boolean
    static Init() : void {

        this.FactionMap = new Map<FactionIdentifier, FactionDescription>()
        this.FactionMap.set(FactionIdentifier.AmbientLife, ambient)
        this.FactionMap.set(FactionIdentifier.Education, education)
        this.FactionMap.set(FactionIdentifier.EmergencyMedical, emergencyMedical)
        this.FactionMap.set(FactionIdentifier.IncidentActors, incidentActors)
        this.FactionMap.set(FactionIdentifier.LawEnforcement, lawEnforcement)
        this.FactionMap.set(FactionIdentifier.Maintenance, maintenance)
        this.FactionMap.set(FactionIdentifier.MalignantActors, malignantActors)
        this.FactionMap.set(FactionIdentifier.OtherGovernment, otherGovt)
        this.FactionMap.set(FactionIdentifier.ParkHosts, parkHosts)
        this.FactionMap.set(FactionIdentifier.PrivateEnterprise, privateEnterprise)
        this.FactionMap.set(FactionIdentifier.PrivateSecurity, privateSecurity)
        this.FactionMap.set(FactionIdentifier.Undeclared, undeclared)

        this._isInitialized = true
    }

    private static _ensureInitialized() : void {
        if (!this._isInitialized) {
            this.Init()
        }
    }

    static GetFactionEnumFromString( factionName : string ) : FactionIdentifier {
        this._ensureInitialized()

        for (const entry in FactionIdentifier) {
            if (entry.lower() === factionName.lower()) {
                return entry as FactionIdentifier
            }
        }
        let factionVals = this.FactionMap.values() as FactionDescription[] 
        for (let entry of factionVals) {
            if (entry.DisplayName.lower() === factionName.lower()) {
                return entry.FactionId
            }
        }
        return FactionIdentifier.Undeclared
    }

    static GetFactionDescription( factionEnum : FactionIdentifier ) : FactionDescription {
        this._ensureInitialized()
        if (this.FactionMap.has(factionEnum)) {
            return this.FactionMap.get(factionEnum) as FactionDescription
        }
        return new FactionDescription(FactionIdentifier.Undeclared, 
            "Undeclared",
            [],
            [])
    }

    static AreFactionsAntagonistic( factionA : FactionIdentifier, factionB : FactionIdentifier ) : boolean {
        this._ensureInitialized()
        if (factionA === factionB) { 
            return false
        }
        let descA = this.GetFactionDescription(factionA)
        let descB = this.GetFactionDescription(factionB)

        return this.IsFactionInAntagonistList(factionA, descB) || 
            this.IsFactionInAntagonistList(factionB, descA)
    }

    static IsFactionInAntagonistList(factionEnum : FactionIdentifier, factionDesc  : FactionDescription) : boolean {
        this._ensureInitialized()
        let antagonists = factionDesc.AntagonisticFactions
        return antagonists.includes(factionEnum)
    }

    static AreFactionsFriendly( factionA : FactionIdentifier, factionB : FactionIdentifier) : boolean {
        this._ensureInitialized()
        if (factionA === factionB) { 
            return true
        }
        let descA = this.GetFactionDescription(factionA)
        let descB = this.GetFactionDescription(factionB)

        return this.IsFactionInFriendlyList(factionA, descB) ||
            this.IsFactionInFriendlyList(factionB, descA)
    }

    static IsFactionInFriendlyList(factionEnum : FactionIdentifier, factionDesc : FactionDescription) : boolean {
        this._ensureInitialized()
        
        let friendlies = factionDesc.FriendlyFactions
        return friendlies.includes(factionEnum)
    }

    static ParseFactionIdsFromCsv(csv : string) : FactionIdentifier[] {
        this._ensureInitialized()
        let parsedIds = new Array<FactionIdentifier>()
        if (csv !== undefined) {
            let valuesArr = csv.split(",")
            valuesArr.forEach(value => {
                parsedIds.push(this.GetFactionEnumFromString(value))
            })
        }

        return parsedIds
    }

    static ParseFactionIdFromString(factionStr : string) : FactionIdentifier {
        this._ensureInitialized()
        return this.GetFactionEnumFromString(factionStr)
    }

    static FactionMap : Map<FactionIdentifier, FactionDescription>

}