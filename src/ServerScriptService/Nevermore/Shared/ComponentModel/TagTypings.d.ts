
export interface ITagService<TInstanceType> {
    new(name : string, typecheck? : (instance : Instance) => boolean) : ITagService<TInstanceType>
    name : string
    has(instance : TInstanceType) : boolean
    add(instance : TInstanceType) : void
    remove(instance : TInstanceType) : unknown
    toggle(instance : TInstanceType) : void
    getTagged() : Array<TInstanceType>
    /**
     * @example
     * ```ts
     * characterTagInstance.onAdded((character : Character) => {
     *      print("Character added:", character.GetFullName())
     * });
     * ```
     * @param callback 
     * @returns RBXScriptConnection
     */
    onAdded(callback : (instance : TInstanceType) => void) : RBXScriptConnection
    /**
     * @example
     *  ```ts
     * characterTagInstance.onRemoved((character : Character) => {
	 *       print("Character removed:", character.GetFullName())
     *  });
     *  ```
     * @param callback
     * @returns RBXScriptConnection
     */
    onRemoved(callback : (instance : TInstanceType) => void) : RBXScriptConnection
}