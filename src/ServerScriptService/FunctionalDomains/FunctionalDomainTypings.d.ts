export interface IExNihilo {
    MoveModelToCoordFrame: ( modelWithPrimaryPart : Model, newCoordFrame: CFrame) => void
    CreateFromFolder: ( storageFolderInstance: Folder, prototypeId: string, coordsForNewInstance: CFrame, createdModelCallback: (personage: Model) => void, targetParent: Instance) => void
    CreateFromServerStorage: ( storageCategory: string, prototypeId: string, coordsForNewInstance: CFrame, createdModelCallback: (personage: Model) => void, targetParent: Instance) => void
    SpawnModelFromPrototype: (prototypeModel: Model, coordsForNewInstance: CFrame, createdModelCallback: (personage: Model) => void, targetParent: Instance) => void
}