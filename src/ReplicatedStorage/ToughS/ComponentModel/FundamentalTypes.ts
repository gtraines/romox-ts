import { requireScript } from '../ScriptLoader';
import { IRquery } from '../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { IRodash } from '../../../ServerScriptService/Nevermore/Shared/rodash/RodashTypings';

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

export class EntityComponentStringValue 
    extends EntityComponentValue<string> 
    implements IEntityComponentValue<string> {
    
    constructor(componentValue: StringValue) {
        super( { Name: componentValue.Name, Value: componentValue.Value })
    }
}

export class EntityComponentBoolValue 
    extends EntityComponentValue<boolean> 
    implements IEntityComponentValue<boolean> {
    constructor(componentValue: BoolValue) {
        super( { Name: componentValue.Name, Value: componentValue.Value })
    }
}

export class EntityComponentIntValue 
    extends EntityComponentValue<number> 
    implements IEntityComponentValue<number> {
    constructor(componentValue: IntValue) {
        super( { Name: componentValue.Name, Value: componentValue.Value })
    }
}

export class EntityComponentNumberValue 
    extends EntityComponentValue<number> 
    implements IEntityComponentValue<number> {
    constructor(componentValue: NumberValue) {
        super( { Name: componentValue.Name, Value: componentValue.Value })
    }
}

export class EntityComponentObjectValue 
    extends EntityComponentValue<unknown> 
    implements IEntityComponentValue<unknown> {
    constructor(componentValue: ObjectValue) {
        super( { Name: componentValue.Name, Value: componentValue.Value })
    }
}

export interface IGameEntity {
    EntityId : string
    EntityInstance : Instance
    GetEntityIdValue() : StringValue
    LogClass(message : string) : void
}

export abstract class GameEntityBase implements IGameEntity {
    constructor(gameEntity : Instance) {
        assert(gameEntity !== undefined);
        this.EntityId = rq.GetOrAddEntityId(gameEntity)
        this.EntityInstance = gameEntity

    }
    EntityInstance : Instance
    EntityId : string
    GetEntityIdValue() : StringValue {
        let entityId = rq.GetOrAddEntityId(this.EntityInstance)
        let entityIdValue = rq.GetOrAddItem("EntityId", "StringValue", this.EntityInstance) as StringValue
        return entityIdValue
    }
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
    GetComponentValue(componentKey : string) : IEntityComponentValue<any>
    GetComponentStringValue(componentKey : string) : string
    GetComponentBoolValue(componentKey : string) : boolean
    GetComponentNumberValue(componentKey : string) : number
    GetComponentsFolder(): Folder
    RemoveComponentValueIfExists(componentName: string) : void
    SetComponentValueFromValueInstance(valueInstance : Instance) : void
    SetComponentNumberValueFromInstance(valueInstance : NumberValue) : void
    SetComponentObjectValueFromInstance(valueInstance : ObjectValue) : void
    SetComponentStringValueFromInstance(valueInstance : StringValue) : void
    SetComponentBoolValue(componentName: string, componentValue: boolean) : void
    SetComponentIntValue(componentName: string, componentValue: number) : void
    SetComponentNumberValue(componentName: string, componentValue: number) : void
    SetComponentObjectValue(componentName: string, componentValue: unknown) : void
    SetComponentStringValue(componentName: string, componentValue: string) : void
}

export class ComponentizedGameEntity extends GameEntityBase implements IComponentizedGameEntity {

    constructor(gameEntity : Instance) {
        super(gameEntity)

        this.Components = new Array<IEntityComponentValue<unknown>>()
        this.LoadComponentsEntriesFromModelComponentsFolder()
    }
    Components : Array<IEntityComponentValue<unknown>>
    GetComponentValue(componentKey : string) : IEntityComponentValue<unknown> {
        let foundValue = this.Components.find(
            (element : IEntityComponentValue<unknown>, idx : number) => {
                return element.Name === componentKey || element.Name.lower() === componentKey.lower()
            }
        ) as IEntityComponentValue<unknown>
        
        return foundValue
    }
    GetComponentBoolValue(componentKey: string): boolean {
        let component = this.GetComponentValue(componentKey) 
        return component.Value as boolean
    }
    GetComponentStringValue(componentKey : string) : string {
        let component = this.GetComponentValue(componentKey) 
        return component.Value as string
    }
    GetComponentNumberValue(componentKey: string): number {
        let component = this.GetComponentValue(componentKey) 
        return component.Value as number
    }
    GetComponentIntValue(componentKey: string): number {
        let component = this.GetComponentValue(componentKey) 
        return component.Value as number
    }
    GetComponentsFolder(): Folder {
        let componentsFolder = 
            rq.GetOrAddItem("Components", "Folder", this.EntityInstance) as Folder
        
        return componentsFolder
    }
    LoadComponentsEntriesFromModelComponentsFolder() : void {
        let componentsFolder = this.GetComponentsFolder()
        let folderEntries = componentsFolder.GetChildren()

        if (folderEntries.size() > 0) {
            for (const entry of folderEntries) {
                this.SetComponentValueFromValueInstance(entry as Instance)
            }
        }
    }
    RemoveComponentValueIfExists(componentName: string) : void {
        let foundValue = this.GetComponentValue(componentName)
        if (foundValue !== undefined) {
            let foundValueIdx = this.Components.indexOf(
                foundValue as IEntityComponentValue<unknown>)
            //let errorMsg = "Found existing component value for " + valueInstance.Name + " in Components array; removing before continuing to add new Value"
            
            this.Components.remove(foundValueIdx)
        }
    }
    SetComponentValueFromValueInstance(valueInstance : Instance) : void {
        

        if (valueInstance.IsA("StringValue")) {
            this.SetComponentStringValueFromInstance(valueInstance as StringValue)
        }
        if (valueInstance.IsA("BoolValue")) {
            this.SetComponentBoolValueFromInstance(valueInstance as BoolValue)
        }
        if (valueInstance.IsA("NumberValue")) {
            this.SetComponentNumberValueFromInstance(valueInstance as NumberValue)
        }
        if (valueInstance.IsA("ObjectValue")) {
            this.SetComponentObjectValueFromInstance(valueInstance as ObjectValue)
        }
        if (valueInstance.IsA("IntValue")) {
            this.SetComponentIntValueFromInstance(valueInstance as IntValue)
        }
    }
    SetComponentBoolValueFromInstance(valueInstance : BoolValue) : void {
        this.RemoveComponentValueIfExists(valueInstance.Name)
        this.Components.push(new EntityComponentBoolValue(valueInstance))
    }
    SetComponentIntValueFromInstance(valueInstance : IntValue) : void {
        this.RemoveComponentValueIfExists(valueInstance.Name)
        this.Components.push(new EntityComponentIntValue(valueInstance))
    }
    SetComponentNumberValueFromInstance(valueInstance : NumberValue) : void {
        this.RemoveComponentValueIfExists(valueInstance.Name)
        this.Components.push(new EntityComponentNumberValue(valueInstance))
    }
    SetComponentObjectValueFromInstance(valueInstance : ObjectValue) : void {
        this.RemoveComponentValueIfExists(valueInstance.Name)
        this.Components.push(new EntityComponentObjectValue(valueInstance))
    }
    SetComponentStringValueFromInstance(valueInstance : StringValue) : void {
        this.RemoveComponentValueIfExists(valueInstance.Name)
        this.Components.push(new EntityComponentStringValue(valueInstance))
    }
    
    SetComponentValueOnEntity(componentName: string, componentValue: Instance) : void {
        
        let componentsFolder = this.GetComponentsFolder()
        let componentEntries = componentsFolder.GetChildren()
        // Already exists?
        let existingValues = componentEntries.filter(
            (entry: Instance) => { 
                return entry.Name === componentName || 
                entry.Name.lower() === componentName.lower() 
            })
        
        if (existingValues.size() > 1) {
            let errorMessage = this.EntityInstance.Name + " has multiple component entries for " + componentName 
            this.LogClass(errorMessage)
            error(errorMessage)
            throw errorMessage
        }

        if (existingValues.size() === 1) {
            let existingEntry = componentsFolder.FindFirstChild(componentName) as Instance
            existingEntry.Parent = undefined
        }
        
        componentValue.Parent = componentsFolder
    }
    SetComponentBoolValue(componentName: string, componentValue: boolean) : void {
        let componentInstanceValue = new Instance("BoolValue") as BoolValue
        componentInstanceValue.Name = componentName
        componentInstanceValue.Value = componentValue
        this.SetComponentValueOnEntity(componentName, componentInstanceValue)
        this.SetComponentBoolValueFromInstance(componentInstanceValue)
    }
    SetComponentIntValue(componentName: string, componentValue: number) : void {
        let componentInstanceValue = new Instance("IntValue") as IntValue
        componentInstanceValue.Name = componentName
        componentInstanceValue.Value = componentValue
        this.SetComponentValueOnEntity(componentName, componentInstanceValue)
        this.SetComponentIntValueFromInstance(componentInstanceValue)
    }
    SetComponentNumberValue(componentName: string, componentValue: number) : void {
        let componentInstanceValue = new Instance("NumberValue") as NumberValue
        componentInstanceValue.Name = componentName
        componentInstanceValue.Value = componentValue
        this.SetComponentValueOnEntity(componentName, componentInstanceValue)
        this.SetComponentNumberValueFromInstance(componentInstanceValue)
    }
    SetComponentObjectValue(componentName: string, componentValue: any) : void {
        let componentInstanceValue = new Instance("ObjectValue") as ObjectValue
        componentInstanceValue.Name = componentName
        componentInstanceValue.Value = componentValue
        this.SetComponentValueOnEntity(componentName, componentInstanceValue)
        this.SetComponentObjectValueFromInstance(componentInstanceValue)
    }
    SetComponentStringValue(componentName: string, componentValue: string) : void {
        let componentInstanceValue = new Instance("StringValue") as StringValue
        componentInstanceValue.Name = componentName
        componentInstanceValue.Value = componentValue
        this.SetComponentValueOnEntity(componentName, componentInstanceValue)
        this.SetComponentStringValueFromInstance(componentInstanceValue)
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