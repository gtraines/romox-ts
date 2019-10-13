
export const TableToMap : (luaTable : Table) => Map<string, unknown> = 
    (luaTable : Table) => {
        let mapResult = new Map<string, unknown>()
        
        let tblArr = luaTable as {[index: string]: unknown}[]
        
        for (let idxInt = 0; idxInt < tblArr.size(); idxInt++) {
            let key2 = tblArr.entries()[idxInt][1] as { key:string, value:unknown }
            mapResult.set( key2.key, key2.value)
        }
        
        return mapResult
    }