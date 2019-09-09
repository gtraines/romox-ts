
export interface IEntityComponentValue<TValueType> {
    Name : string
    Value : TValueType
}

export interface IGameEntity {
    EntityId : string
}

export interface ICollectibleGameEntity { 
    Collections : Array<string>
}

export interface IComponentizedGameEntity extends IGameEntity {
    Components : Array<IEntityComponentValue<any>>
    GetComponentValue(componentKey : string) : any
    GetComponentStringValue(componentKey : string) : string
    GetComponentBoolValue(componentKey : string) : boolean
    GetComponentNumberValue(componentKey : string) : number
}

export interface ICloneableGameEntity extends IComponentizedGameEntity {
    PrototypeId : string
}

export interface IGameModel extends ICloneableGameEntity {
    ModelInstance : Model
}