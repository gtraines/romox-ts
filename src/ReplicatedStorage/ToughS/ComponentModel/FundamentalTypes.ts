import { requireScript } from '../ScriptLoader';
import { IRquery } from '../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { ReplicatedStorage } from '@rbxts/services';
import { IRodash } from '../../../ServerScriptService/Nevermore/Shared/rodash/RodashTypings';
import { StretcherTool } from '../../Equipment/Reference/LegacyStretcher';

const _ = requireScript("rodash") as IRodash
const rq = requireScript("rquery") as IRquery


export interface IEntityComponentValue<TValueType> {
    Name : string
    Value : TValueType
}

export abstract class EntityComponentValue<TValueType> 
    implements IEntityComponentValue<TValueType> {

    constructor(componentValue :{ Name : string, Value : TValueType }) {
        
        this.Name = componentValue.Name
        this.Value = componentValue.Value
    }
    Name : string
    Value : TValueType
}

export interface IGameEntity {
    LogClass(message : string) : void
    EntityId : string
}

export abstract class GameEntityBase implements IGameEntity {
    constructor(gameEntity : Instance) {
        assert(gameEntity !== undefined);
        this.EntityId = rq.GetOrAddEntityId(gameEntity)
    }
    EntityId : string
    LogClass(message : string) : void {
        
        let className = tostring(this)
        let msgPrefix = "[" + className + "] "
        print(msgPrefix, message)
    }
}

export interface ICollectibleGameEntity { 
    Collections : Array<string>
}

export interface IComponentizedGameEntity extends IGameEntity {
    Components : Array<IEntityComponentValue<any>>
    GetComponentValue(componentKey : string) : unknown
    GetComponentStringValue(componentKey : string) : string
    GetComponentBoolValue(componentKey : string) : boolean
    GetComponentNumberValue(componentKey : string) : number
}

export class ComponentizedGameEntity extends GameEntityBase implements IComponentizedGameEntity {

    constructor(gameEntity : Instance) {
        super(gameEntity)

        this.Components = new Array<IEntityComponentValue<any>>()
        
        let componentsFolder = rq.GetOrAddItem("Components", "Folder", gameEntity) as Folder
        let componentEntries = componentsFolder.GetChildren()
        componentEntries.forEach(element => {
            if (element.IsA("Instance")) {
                componentEntries.push(element)
            }
        });
    }
    Components : Array<IEntityComponentValue<any>>
    GetComponentValue(componentKey : string) : unknown {
        let foundValue = this.Components.find(
            (element : IEntityComponentValue<any>, idx : number) => {
                return element.Name === componentKey || element.Name.lower() === componentKey.lower()
            }
        )
        return foundValue
    }
    GetComponentStringValue(componentKey : string) : string {
        return this.GetComponentValue(componentKey) as string
    }
    GetComponentBoolValue(componentKey: string): boolean {
        return this.GetComponentValue(componentKey) as boolean
    }
    GetComponentNumberValue(componentKey: string): number {
        return this.GetComponentNumberValue(componentKey) as number
    }
}

export interface ICloneableGameEntity extends IComponentizedGameEntity {
    PrototypeId : string
}

export interface IGameModel extends ICloneableGameEntity {
    ModelInstance : Model
}

export class GameModel extends ComponentizedGameEntity implements IGameModel {
    /**
     * Includes all of the GameEntity functionality
     */
    constructor(modelInstance : Model) {
        super(modelInstance)
        this.PrototypeId = rq.StringValueOrNil("PrototypeId", modelInstance)
        this.ModelInstance = modelInstance
    }
    ModelInstance: Model;    
    PrototypeId: string;
}