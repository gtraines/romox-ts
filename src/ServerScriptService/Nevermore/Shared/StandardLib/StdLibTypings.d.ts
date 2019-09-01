export interface IRandumbModule {
    Init(sortOfSeed : number) : void;
    GetOneAtRandom<T>(collection : Array<T>) : T;
    CoinFlip<T>(choiceA : T, choiceB : T) : T;
    GetIntegerBtwn(start : number, finish : number ) : number;
    ShuffleList<T>(listToShuffle : Array<T>) : Array<T>;
}

export interface IWraptor {
    DEPRECATED: (func : (...args : any[]) => any, funcName : string, reason : string) 
        => (...args : any[]) => any;
    TryCatch: (funcTry : (...args : any[]) => any, catchFunc : (err : any) => any)
        => any;
    xpcall: (call : (...args : any[]) => any, handler : (err : any) => any) 
        => any;
    WithCoolDown: (coolDownTime : number, func : (...args : any[]) => any)
        => any;
}

export interface IUuid {
    seed : () => void;
    randomseed : (seed: number) => number;
}

export interface IQueue<TElement> {
    Enqueue(value : TElement) : void;
    Dequeue() : TElement;
    Front() : TElement;
    Back() : TElement;
    Length() : number;
}