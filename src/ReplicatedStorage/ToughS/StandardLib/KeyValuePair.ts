export interface IKeyValuePair<TKey, TValue> {
    Key : TKey;
    Value : TValue;
}

export class KeyValuePair<TKey, TValue> 
    implements IKeyValuePair<TKey, TValue> {
    constructor(key : TKey, value: TValue) {
        this.Key = key
        this.Value = value
    }
    Key : TKey
    Value : TValue
}
