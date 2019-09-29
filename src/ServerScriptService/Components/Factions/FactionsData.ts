import { FactionIdentifier, FactionDescription } from './FactionDescriptions';


const police = new FactionDescription(
    FactionIdentifier.Police,
    "Police",
    [
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Medical,
        FactionIdentifier.Government
    ],
    [
        FactionIdentifier.Victim,
        FactionIdentifier.Witness,
        FactionIdentifier.Civilian,
        FactionIdentifier.OtherWounded
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker
    ]
)

const fireDept = new FactionDescription(
    FactionIdentifier.FireDepartment,
    "Fire Department",
    [
        FactionIdentifier.Police,
        FactionIdentifier.Medical,
        FactionIdentifier.Government
    ],
    [
        FactionIdentifier.Victim,
        FactionIdentifier.Witness,
        FactionIdentifier.Civilian,
        FactionIdentifier.OtherWounded
    ],
    [
        FactionIdentifier.Criminal
    ]
)

const medical = new FactionDescription(
    FactionIdentifier.Medical,
    "Medical",
    [
        FactionIdentifier.Police,
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Government
    ],
    [
        FactionIdentifier.Victim,
        FactionIdentifier.Witness,
        FactionIdentifier.OtherWounded,
        FactionIdentifier.Civilian,
        FactionIdentifier.Criminal,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker
    ],
    [
    ]
)

const civilian = new FactionDescription(
    FactionIdentifier.Civilian,
    "Civilian",
    [
        FactionIdentifier.Witness,
        FactionIdentifier.Victim,
        FactionIdentifier.Government,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator,
        FactionIdentifier.OtherWounded
    ],
    [
        FactionIdentifier.Police,
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Medical
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker
    ]
)

const victim = new FactionDescription(
    FactionIdentifier.Victim,
    "Victim",
    [
        FactionIdentifier.Witness,
        FactionIdentifier.OtherWounded,
        FactionIdentifier.Government,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator
    ],
    [
        FactionIdentifier.Police,
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Medical
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker
    ]
)

const witness = new FactionDescription(
    FactionIdentifier.Witness,
    "Witness",
    [
        FactionIdentifier.Victim,
        FactionIdentifier.OtherWounded,
        FactionIdentifier.Government,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator
    ],
    [
        FactionIdentifier.Police,
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Medical
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker
    ]
)

const wounded = new FactionDescription(
    FactionIdentifier.OtherWounded,
    "Wounded Person",
    [
        FactionIdentifier.Civilian,
        FactionIdentifier.Victim,
        FactionIdentifier.Witness,
        FactionIdentifier.Government,
        FactionIdentifier.Medical,
        FactionIdentifier.FireDepartment
    ],
    [
        FactionIdentifier.Police
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator
    ]
)


const government = new FactionDescription(
    FactionIdentifier.Government,
    "Government Personnel",
    [
        FactionIdentifier.Police,
        FactionIdentifier.FireDepartment,
        FactionIdentifier.Medical
    ],
    [
        FactionIdentifier.Victim,
        FactionIdentifier.Civilian,
        FactionIdentifier.OtherWounded,
        FactionIdentifier.Witness,
    ],
    [
        FactionIdentifier.Criminal,
        FactionIdentifier.SuspiciousPerson,
        FactionIdentifier.TroubleMaker,
        FactionIdentifier.BadDriver,
        FactionIdentifier.CivilViolator
    ]
)

export const FactionsLookup = 
    new Map<FactionIdentifier, FactionDescription>()