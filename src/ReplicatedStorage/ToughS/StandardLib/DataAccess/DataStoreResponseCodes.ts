
export interface IDataStoreResponseCode {
    ErrorCode: number
    ErrorMessage: string
    Notes: string
}

export class DataStoreResponseCode implements IDataStoreResponseCode {
    /**
     *
     */
    constructor(errorCode: number, errorMessage: string) {
        this.ErrorCode = errorCode
        this.ErrorMessage = errorMessage
        this.Notes = ""
    }
    ErrorCode: number;    
    ErrorMessage: string;
    Notes: string;
}

export class ResponseCodesLookup {
    protected static _responseCodes? : Map<number, IDataStoreResponseCode>
    protected static _isInitialized? : boolean
    protected static _ensureInitialized() : void {
        if (this._isInitialized === undefined || this._isInitialized === false) {
            this._setCodeLookup()    
            this._isInitialized = true
        }
    }
    protected static _setCodeLookup() : void {
        this._responseCodes = new Map<number, IDataStoreResponseCode>()

        this._responseCodes.set(101, 
            new DataStoreResponseCode(101, "Key name can't be empty."))

        this._responseCodes.set(102, 
            new DataStoreResponseCode(102, "Key name exceeds the 50 character limit."))

        this._responseCodes.set(103, 
            new DataStoreResponseCode(103, "X is not allowed in DataStor"))

        this._responseCodes.set(104, 
            new DataStoreResponseCode(104, "Cannot store X in DataStore	A"))

        this._responseCodes.set(105, 
            new DataStoreResponseCode(105, "Serialized value converted byte size exceeds max size 64*1024 bytes."))

        this._responseCodes.set(106, 
            new DataStoreResponseCode(106, "MaxValue and MinValue must to be integer"))

        this._responseCodes.set(301, 
            new DataStoreResponseCode(301, "GetAsync request dropped."))

        this._responseCodes.set(302, 
            new DataStoreResponseCode(302, "SetAsync request dropped."))

        this._responseCodes.set(303, 
            new DataStoreResponseCode(303, "IncrementAsync request dropped."))

        this._responseCodes.set(304, 
            new DataStoreResponseCode(304, "UpdateAsync request dropped."))

        this._responseCodes.set(305, 
            new DataStoreResponseCode(305, "GetSorted request dropped."))

        this._responseCodes.set(306, 
            new DataStoreResponseCode(306, "RemoveAsync request dropped."))

        this._responseCodes.set(401, 
            new DataStoreResponseCode(401, "Request Failed. DataModel Inaccessible when game shutting down."))

        this._responseCodes.set(402, 
            new DataStoreResponseCode(402, "Request Failed. LuaWebService Inaccessible when game shutting down."))

        this._responseCodes.set(403, 
            new DataStoreResponseCode(403, "Cannot write to DataStore from studio if API access is not enabled."))

        this._responseCodes.set(404, 
            new DataStoreResponseCode(404, "OrderedDataStore does not exist."))

        this._responseCodes.set(501, 
            new DataStoreResponseCode(501, "Can't parse response, data may be corrupted."))

        this._responseCodes.set(502, 
            new DataStoreResponseCode(502, "API Services rejected request with error: X."))

        this._responseCodes.set(503, 
            new DataStoreResponseCode(503, "DataStore Request successful, but key not found."))

        this._responseCodes.set(504, 
            new DataStoreResponseCode(504, "Datastore Request successful, but response not formatted correctly."))

        this._responseCodes.set(505, 
            new DataStoreResponseCode(505, "OrderedDatastore Request successful, but response not formatted correctly."))

    }
    static GetInfoFromCode(errorCode: number) : IDataStoreResponseCode | undefined {
        this._ensureInitialized()
        if (this._responseCodes !== undefined) {
            if (this._responseCodes.has(errorCode)) {
                return this._responseCodes.get(errorCode)
            }
        }

        return undefined
    }
}