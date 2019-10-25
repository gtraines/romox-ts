import { IKeyValuePair } from '../../../../ReplicatedStorage/ToughS/StandardLib/KeyValuePair';

export interface IRodash {
    slice: (source : Array<object>, first? : number, last? : number, step? : number) => object[]
    get: <TKey, TValue>(source : Iterable<object>, key : TKey, ... keys : TKey[]) => TValue
    map: <TKey, TValueA, TValueB>(source: Iterable<IKeyValuePair<TKey, TValueA>>,
        handler: (element: IKeyValuePair<TKey, TValueA>) => TValueB) => Iterable<IKeyValuePair<TKey, TValueB>>
    mapValues: <TKey, TValueA, TValueB>(source: Iterable<IKeyValuePair<TKey, TValueA>>,
        handler: (element: IKeyValuePair<TKey, TValueA>) => TValueB) => Iterable<IKeyValuePair<TKey, TValueB>>
    mapKeys: <TKey, TValueA, TValueB>(source: Iterable<IKeyValuePair<TKey, TValueA>>,
        handler: (element: TValueA, key: TKey) => TValueB) => Iterable<IKeyValuePair<TKey, TValueB>>
    flatMap: <TKey, TValue, TUnion>(source : Iterable<IKeyValuePair<TKey, TValue>>, 
        handler: (element: TValue, key: TKey) => TUnion[]) => TUnion[]
    shuffle: <Iterable>(source : Iterable) => Iterable
    filter: <TKey, TValue>(source: Iterable<IKeyValuePair<TKey, TValue>>, handler: (element: TValue, key: TKey) => boolean) => TValue[]
}