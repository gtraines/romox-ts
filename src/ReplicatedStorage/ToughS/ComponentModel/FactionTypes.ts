

export interface IFactionable {
    Factions : string[]
    AddAllFactions(...factions : string[]) : void
    AddFaction(faction : string) : void
    ClearFactions() : void
    HasAllFactions(...factions : string[]) : boolean
    HasAnyFactionIn(...factions : string[]) : boolean
    HasFaction(faction : string) : boolean
    TryRemoveFaction(faction : string) : boolean
}

export class Factionable implements IFactionable {
    constructor(...startingFactions : string[]) {
        this.Factions = new Array<string>()
        startingFactions.forEach(faction => {
            this.Factions.push(faction)
        });
    }
    Factions: string[];
    HasFaction(faction: string): boolean {
        let foundFaction = this.Factions.find(elem => { 
            return elem.lower() === faction.lower()
        })
        return foundFaction === faction
    }
    HasAnyFactionIn(...factions: string[]): boolean {
        let foundFaction = false
        factions.forEach(faction => {
            if (this.Factions.includes(faction.lower())) {
                foundFaction = true
            }
        })

        return foundFaction
    }
    HasAllFactions(...factions: string[]): boolean {
        let missingFaction = false

        factions.forEach(faction => {
            if (!this.Factions.includes(faction.lower())) {
                missingFaction = true
            }
        })
        return !missingFaction
    }
    AddAllFactions(...factions : string[]) : void {
        factions.forEach(faction => {
            if (! this.Factions.includes(faction.lower())) {
                this.Factions.push(faction.lower())
            }
        })
    }
    AddFaction(faction: string): void {
        if (! this.Factions.includes(faction.lower())) {
            this.Factions.push(faction.lower())
        }
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