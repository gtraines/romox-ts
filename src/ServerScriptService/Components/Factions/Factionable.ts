import { IRquery } from '../../Nevermore/Shared/StandardLib/StdLibTypings';
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
const rq = requireScript<IRquery>("rquery")


export interface IFactionComponent {
    Factions : string[]
    AddFaction(faction : string) : void
    AddAllFactions(...factions : string[]) : void
    ClearFactions() : void
    HasAllFactions(...factions : string[]) : boolean
    HasAnyFactionIn(...factions : string[]) : boolean
    HasFaction(faction : string) : boolean
    LoadFromCommaSeparatedString(csv : string) : void
    LoadFromStringValue(stringValue : StringValue) : void
    TryRemoveFaction(faction : string) : boolean
}

export class FactionComponent implements IFactionComponent {
    constructor(...startingFactions : string[]) {
        this.Factions = new Array<string>()
        startingFactions.forEach((faction : string) => {
            this.AddFaction(faction)
        })
    }
    Factions: string[]
    AddFaction(faction: string): void {
        if (! this.Factions.includes(faction.lower())) {
            this.Factions.push(faction.trim().lower())
        }
    }
    AddAllFactions(...factions : string[]) : void {
        factions.forEach(faction => {
            this.AddFaction(faction)
        })
    }
    LoadFromCommaSeparatedString(csv : string) : void {
        if (csv !== undefined) {
            let valuesArr = csv.split(",")
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
    HasFaction(faction: string): boolean {
        let foundFaction = this.Factions.find(elem => { 
            return elem.lower() === faction.trim().lower()
        })
        return foundFaction === faction
    }
    HasAnyFactionIn(...factions: string[]): boolean {
        let foundFaction = false
        factions.forEach(faction => {
            if (this.HasFaction(faction)) {
                foundFaction = true
            }
        })

        return foundFaction
    }
    HasAllFactions(...factions: string[]): boolean {
        let missingFaction = false

        factions.forEach(faction => {
            if (!this.HasFaction(faction)) {
                missingFaction = true
            }
        })
        return !missingFaction
    }

    TryRemoveFaction(faction : string) : boolean {
        if (this.Factions.includes(faction.lower())) {
            let foundIdx = this.Factions.indexOf(faction.lower())
            this.Factions.remove(foundIdx)
            return true
        }
        return false
    }
    ClearFactions(): void {
        this.Factions = new Array<string>()
    }
}

export interface IFactionable {
   FactionTracker : IFactionComponent 
}