import { IToolBase, ToolBase } from './ToolBase';
import { requireScript } from '../ToughS/ScriptLoader';
import { IRquery } from '../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';
import { PersonageCrawler } from '../ToughS/StandardLib/PersonageCrawler';

const rq = requireScript("rquery") as IRquery

export interface IStretcherTool extends IToolBase {
    GetOnTouchedHandler() : (part : BasePart) => void
    GetTouchPad() : Part
    IsOccupied() : boolean
    Occupant? : Model
    StretcherModel : Model
    StretcherSeat : Seat
}

export class StretcherTool extends ToolBase implements IStretcherTool {
    constructor(toolModel : Model) {
        super(toolModel)
        this.StretcherModel = toolModel.FindFirstChild("Stretcher") as Model
        this.StretcherSeat = this.StretcherModel.FindFirstChildWhichIsA("Seat") as Seat
        this.StretcherSeat.Disabled = true
    }
    GetOnTouchedHandler(): (part: BasePart) => void {
        let handler = (part : BasePart ) => {
            let foundHumanoid = rq.AttachedHumanoidOrNil(part as Part) as Humanoid
            if (foundHumanoid !== undefined && !this.IsOccupied()) {
                let health = foundHumanoid.Health 
                let personageModel = foundHumanoid.Parent as Model
                let isAlivePersonage = foundHumanoid.Health > 0
                if (isAlivePersonage && health < 100 && !this.IsOccupied() && this.ToolInstance.Parent !== personageModel) {
                    print("Detected personage: ", personageModel.Name)
                    print("Parent personage: ", this.ToolInstance.Parent)
                    let personagePart = personageModel.FindFirstChild("HumanoidRootPart") as Part
                    if (personagePart === undefined) {
                        personagePart = rq.PersonageTorsoOrEquivalent(personageModel)
                    }
                    if (this.TouchPadConnection !== undefined) {
                        print("Disconecting handler")
                        this.TouchPadConnection.Disconnect()
                    }
                    this.StretcherSeat.Disabled = false
                    let stretcherSeatLocation = this.StretcherSeat.CFrame
                    personagePart.CFrame = stretcherSeatLocation.add(new Vector3(0, 1, 0))
                    //foundHumanoid.Sit = true
                    this.StretcherSeat.Sit(foundHumanoid)
                    this.Occupant = personageModel
                }
                
            }
            if (!this.IsOccupied()) {
                this.StretcherSeat.Disabled = true
            }
            
            wait(0.5)
            if (this.TouchPadConnection !== undefined && !this.TouchPadConnection.Connected) {
                this.TouchPadConnection = this.GetTouchPad().Touched.Connect(this.GetOnTouchedHandler())
            }
            
        }

        return handler
    }    
    GetTouchPad(): Part {
        let touchPad = this.StretcherModel.FindFirstChild("TouchPad") 
        
        return touchPad as Part
    }
    IsOccupied(): boolean {
        return this.StretcherSeat.Occupant !== undefined
    }
    Occupant?: Model | undefined;
    ConfigureToolInstance(): void {

    }
    GetOnEquipHandler(): (mouse: Mouse) => void {
        let equipHandler = (mouse: Mouse) => {
            this.TouchPadConnection = this.GetTouchPad().Touched.Connect(this.GetOnTouchedHandler())
        }
        return equipHandler
    }
    GetOnUnequipHandler(): (mouse: Mouse) => void {
        let unequipHandler = (mouse: Mouse) => {
            if (this.TouchPadConnection !== undefined) {
                this.TouchPadConnection.Disconnect()
            }
        }
        return unequipHandler
    }
    EquippedConnection?: RBXScriptConnection | undefined;
    UnequippedConnection?: RBXScriptConnection | undefined;
    TouchPadConnection?: RBXScriptConnection 
    StretcherModel : Model
    StretcherSeat : Seat
}