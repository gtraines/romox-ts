export const TableToMap : (table : Table) => Map<string, any> = 
    (table : Table) => {
        let mapResult = new Map<string, any>()
        
        let tblArr = table as {[index: string]: any}[]

        tblArr.forEach((property : {[index: string]: any}) => {
            mapResult.set(property[0], property[1])
        })

        return mapResult
    }