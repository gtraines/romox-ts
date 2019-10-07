import { FactionIdentifier } from './FactionDescriptions';
import { FactionLookup } from './FactionsData';

export interface IFactionComponent {
    Factions : FactionIdentifier[]
    AddFaction(factionId : FactionIdentifier) : void
    AddAllFactions(...factions : string[]) : void
    ClearFactions() : void
    HasAllFactions(...factions : FactionIdentifier[]) : boolean
    HasAnyFactionIn(...factions : FactionIdentifier[]) : boolean
    HasFaction(factionId : FactionIdentifier) : boolean
    LoadFromCommaSeparatedString(csv : string) : void
    LoadFromStringValue(stringValue : StringValue) : void
    TryRemoveFaction(factionId : FactionIdentifier) : boolean
}

export class FactionComponent implements IFactionComponent {
    constructor(...startingFactions : string[]) {
        this.Factions = new Array<FactionIdentifier>()
        this.AddAllFactions(...startingFactions)
    }
    Factions: FactionIdentifier[]
    AddFaction(factionId: FactionIdentifier): void {
        if (!this.Factions.includes(factionId)) {
            this.Factions.push(factionId)
        }
    }
    AddAllFactions(...factions : string[]) : void {
        factions.forEach(faction => {
            this.AddFaction(
                FactionLookup.ParseFactionIdFromString(faction)
                )
        })
    }
    LoadFromCommaSeparatedString(csv : string) : void {
        if (csv !== undefined) {
            let valuesArr = FactionLookup.ParseFactionIdsFromCsv(csv)
            valuesArr.forEach(value => {
                this.AddFaction(value)
            })
        }
        
    }
    LoadFromStringValue(stringValue : StringValue) : void {
        if (stringValue !== undefined && stringValue.Value !== undefined) {
            this.LoadFromCommaSeparatedString(stringValue.Value)
        }
    }
    HasFaction(factionId: FactionIdentifier): boolean {
        let foundFaction = this.Factions.includes(factionId)
        return foundFaction
    }
    HasAnyFactionIn(...factions: FactionIdentifier[]): boolean {
        let foundFaction = false
        factions.forEach(faction => {
            if (this.HasFaction(faction)) {
                foundFaction = true
            }
        })

        return foundFaction
    }
    HasAllFactions(...factions: FactionIdentifier[]): boolean {
        let missingFaction = false

        factions.forEach(faction => {
            if (!this.HasFaction(faction)) {
                missingFaction = true
            }
        })
        return !missingFaction
    }

    TryRemoveFaction(factionId : FactionIdentifier) : boolean {
        if (this.Factions.includes(factionId)) {
            let foundIdx = this.Factions.indexOf(factionId)
            this.Factions.remove(foundIdx)
            return true
        }
        return false
    }

    ClearFactions(): void {
        this.Factions = new Array<FactionIdentifier>()
    }
}
