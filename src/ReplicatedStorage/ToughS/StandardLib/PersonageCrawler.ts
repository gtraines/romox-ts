// PersonageCrawler
import { requireScript } from '../../../ReplicatedStorage/ToughS/ScriptLoader';
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

export interface IPersonageCrawler {
    IsPersonageR6(personageOrPlayer : Instance) : boolean
    GetArms(personageOrPlayer : Instance) : IPersonageArms
    GetShoulders(personageOrPlayer : Instance) : IPersonageShoulders
    GetHumanoid : (personage : Model) => Humanoid
    GetRootPart : (personage : Model) => BasePart
    IsPersonagePlayer : (personage : Model) =>  boolean
}

export class PersonageCrawler implements IPersonageCrawler {
    GetHumanoid = (personage : Model) => {
        assert(personage.IsA("Model"))
        let humanoidCandidateInstance = personage.FindFirstChildWhichIsA("Humanoid")
        if (humanoidCandidateInstance !== undefined && humanoidCandidateInstance.IsA(
            "Humanoid"))  
            {
                return humanoidCandidateInstance as Humanoid
            }
        
        let desc = personage.GetDescendants()
        desc.forEach(element => {
            if (element.IsA("Humanoid")) {
                return element
            }
        });

        throw "No humanoid found on " + personage.Name
    }

    GetRootPart = (personage : Model) => {
        assert(personage.IsA("Model"))
        let rootPart = personage.FindFirstChild("HumanoidRootPart") as BasePart
        if (rootPart === undefined) {
            if (personage.PrimaryPart !== undefined) {
                rootPart = personage.PrimaryPart
            }
            else {
                rootPart = rq.PersonageTorsoOrEquivalent(personage)
            }
        }

        return rootPart
    };
    IsPersonagePlayer = (personage : Model) => {
        assert(personage.IsA("Model"))
        
        let player = rq.GetPlayerFromCharacterOrDescendant(personage as Model)
        if (player !== undefined) {
            return true
        }
        
        return false
    };
    IsPersonageR6(personageOrPlayer : Instance) {
        let foundHumanoid = rq.GetPersonageOrPlayerHumanoidOrNil(personageOrPlayer)
        if (foundHumanoid !== undefined) {
            return foundHumanoid.RigType === Enum.HumanoidRigType.R6
        }
        throw "Not a valid Humanoid-carrying Instance";
    }
    GetArms(personageOrPlayer : Instance) : IPersonageArms {
        let arms = new PersonageArms()
        let humanoid = rq.GetPersonageOrPlayerHumanoidOrNil(personageOrPlayer)
        let personage = humanoid.Parent as Instance
        if (this.IsPersonageR6(personageOrPlayer)) {
            arms.Left = personage.FindFirstChild("Left Arm")
            arms.Right = personage.FindFirstChild("Right Arm")
        } else {
            arms.Left = personage.FindFirstChild("LeftLowerArm")
            arms.Right = personage.FindFirstChild("RightLowerArm")
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