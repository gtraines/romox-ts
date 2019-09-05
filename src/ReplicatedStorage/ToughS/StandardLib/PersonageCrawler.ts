import { requireScript } from '../ScriptLoader';
import { IRquery } from '../../../ServerScriptService/Nevermore/Shared/StandardLib/StdLibTypings';

const rq = requireScript("rquery") as IRquery

export interface IPersonageShoulders {
    Left? : Motor6D;
    Right? : Motor6D;
}

export class PersonageShoulders implements IPersonageShoulders {
    constructor() {
        
    }
    Left? : Motor6D;
    Right? : Motor6D;
}

export interface IPersonageArms {
    Left? : Part;
    Right? : Part;
}

export class PersonageArms implements IPersonageArms {
    constructor() {
        
    }
    Left? : Part;
    Right? : Part;
}


export class PersonageCrawler {
    IsPersonageR6(personageOrPlayer : Instance) : boolean {
        let foundHumanoid = rq.GetPersonageOrPlayerHumanoidOrNil(personageOrPlayer)
        if (foundHumanoid !== undefined) {
            return foundHumanoid.RigType === Enum.HumanoidRigType.R6
        }
        throw "Not a valid Humanoid-carrying Instance";
    }
    GetArms(personageOrPlayer : Instance) : IPersonageArms {
        
        let arms = new PersonageArms()
        if (this.IsPersonageR6(personageOrPlayer)) {
            let humanoid = rq.GetPersonageOrPlayerHumanoidOrNil(personageOrPlayer)
            let personage = humanoid.Parent as Instance
            arms.Left = personage.FindFirstChild("Left Arm")
            arms.Right = personage.FindFirstChild("Right Arm")
        } else {

        }

        return arms
    }
    GetShoulders(personageOrPlayer : Instance) : IPersonageShoulders {
        if (this.IsPersonageR6(personageOrPlayer)) {
            return this._getShouldersR6(personageOrPlayer)
        }
        return this._getShouldersR15(personageOrPlayer)

    }
    _getShouldersR6(personage : Instance) : IPersonageShoulders {
        
        let torso = rq.PersonageTorsoOrEquivalent(personage as Model)
        let shoulders = new PersonageShoulders()
        shoulders.Left = torso.FindFirstChild("Left Shoulder") as Motor6D
        shoulders.Right = torso.FindFirstChild("Right Shoulder") as Motor6D

        return shoulders
    }
    _getShouldersR15(personageOrPlayer : Instance) : IPersonageShoulders {
        let humanoid = rq.GetPersonageOrPlayerHumanoidOrNil(personageOrPlayer)
        let personage = humanoid.Parent as Instance
        let lUpperArm = personage.FindFirstChild("LeftUpperArm") as Part
        let rUpperArm = personage.FindFirstChild("RightUpperArm") as Part

        let shoulders = new PersonageShoulders()
        shoulders.Left = lUpperArm.FindFirstChild("LeftShoulder") as Motor6D
        shoulders.Right = rUpperArm.FindFirstChild("RightShoulder") as Motor6D

        return shoulders
    }
}