export interface IAmbulanceStretcher {
    ConnectToEvents: (toolModel : Model) => Model;
    AttachToModel: (toolModel : Model) => void
    Equip: (mouse: any) => void;
    Unequip: (mouse: any) => void;
}