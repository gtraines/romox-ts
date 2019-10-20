export interface IToolBase {
    ConnectToEvents() : void
    ConfigureToolInstance() : void
    GetOnEquipHandler() : (mouse : Mouse) => void
    GetOnUnequipHandler() : (mouse : Mouse) => void
    ToolModel : Model
    ToolInstance : Tool
    EquippedConnection? : RBXScriptConnection
    UnequippedConnection? : RBXScriptConnection
}

export abstract class ToolBase implements IToolBase {
    constructor(toolModel : Model) {
        // When a squirrel starts talking
        this.ToolModel = toolModel
        this.ToolInstance = toolModel.FindFirstChildWhichIsA("Tool") as Tool
        this.ConfigureToolInstance()
        this.ConnectToEvents()
    }
    ConnectToEvents(): void {
        this.EquippedConnection = this.ToolInstance.Equipped.Connect(this.GetOnEquipHandler())
        this.UnequippedConnection = this.ToolInstance.Equipped.Connect(this.GetOnUnequipHandler())
    }    
    abstract ConfigureToolInstance(): void
    abstract GetOnEquipHandler(): (mouse: Mouse) => void
    abstract GetOnUnequipHandler(): (mouse: Mouse) => void
    ToolModel: Model
    ToolInstance: Tool
    EquippedConnection? : RBXScriptConnection
    UnequippedConnection? : RBXScriptConnection
}