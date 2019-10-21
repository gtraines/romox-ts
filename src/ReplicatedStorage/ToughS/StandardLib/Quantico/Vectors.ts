
export interface IVector {
    Elements : Array<number>
    AddScalar(scalarValue : number) : IVector
    Copy() : IVector
    DivideByScalar(scalarValue : number) : IVector
    GetElement(idx : number) : number
    SetElement(idx: number, newValue: number) : void
    GetRank() : number
    MultiplyScalar(scalarValue : number) : IVector
    SubtractScalar(scalarValue : number) : IVector
}

export class Vector implements IVector {
    Elements : Array<number>
    constructor(startingElements? :Array<number>) {
        if (startingElements !== undefined) {
            this.Elements = startingElements
        } else {
            this.Elements = new Array<number>()
        }
    }    
    GetRank() : number {
        return this.Elements.size()
    }
    GetElement(idx : number) : number {
        return this.Elements[idx]
    }
    SetElement(idx: number, newValue: number) : void {
        this.Elements[idx] = newValue
    }
    _performMappingOnAllElements(mappingFn: (scalarValue: number) => number ): Array<number> {
        let elementsMemo = this.Elements.copy()

        this.Elements = elementsMemo.map(mappingFn)
        return this.Elements
    }
    AddScalar(scalarValue : number) : IVector {
        this._performMappingOnAllElements(( elementValue : number ) => {
            return elementValue + scalarValue
        })
        return this
    }
    MultiplyScalar(scalarValue : number) : IVector {

        this._performMappingOnAllElements(( elementValue : number ) => {
            return elementValue * scalarValue
        })
        return this
    }
    DivideByScalar(scalarValue : number) : IVector {
        
        this._performMappingOnAllElements(( elementValue : number ) => {
            return elementValue / scalarValue
        })
        return this
    }
    SubtractScalar(scalarValue : number) : IVector {
        
        this._performMappingOnAllElements(( elementValue : number ) => {
            return elementValue - scalarValue
        })
        return this
    }
    size(): number {
        return this.Elements.size()
    }
    Copy() : IVector {
        return new Vector(this.Elements)
    }
    static VectorToVector(
        vectorA : IVector, 
        vectorB : IVector, 
        operation : 
            (valueA : number, valueB : number) 
                => number) 
    : IVector {
        
        if (vectorA.GetRank() !== vectorB.GetRank()) {
            let msg = "Vectors must be of equal length: vectorA: " + 
                tostring(vectorA.GetRank()) + 
                " vectorB: " + tostring(vectorB.GetRank())
            throw msg
        }

        let newArr = new Array<number>()

        for (let idx = 0; idx < vectorA.GetRank(); idx++) {
            let valA = vectorA.GetElement(idx)
            let valB = vectorB.GetElement(idx)

            newArr.push(operation(valA, valB))
        }

        return new Vector(newArr)
    }
    static _VectorToVectorElementwiseFuncHelper(
        elementwiseOp : (valueA:number, valueB:number) => number) 
        : (vectorA : IVector, vectorB: IVector) => IVector {
        let newFunc = (vectorA : IVector, vectorB : IVector) => {
            return this.VectorToVector(vectorA, vectorB, elementwiseOp)
        }
        return newFunc 
    }
    static DivideVectors(vectorA : IVector, vectorB : IVector) : IVector {
        let elemwiseOp = (valueA : number, valueB : number) => {
            return valueA / valueB
        }
        
        return this.VectorToVector(vectorA, vectorB, elemwiseOp)
    }
    static MultiplyVectors(vectorA : IVector, vectorB : IVector) : IVector {
        let elemwiseOp = (valueA : number, valueB : number) => {
            return valueA * valueB
        }
        
        return this.VectorToVector(vectorA, vectorB, elemwiseOp)
    }
    static AddVectors(vectorA : IVector, vectorB : IVector) : IVector {        
        let elemwiseOp = (valueA : number, valueB : number) => {
            return valueA + valueB
        }
        let doThis = this._VectorToVectorElementwiseFuncHelper(elemwiseOp)
        return doThis(vectorA, vectorB)
    }
    static SubtractVectors(vectorA : IVector, vectorB : IVector) : IVector {
        let elemwiseOp = (valueA : number, valueB : number) => {
            return valueA - valueB
        }
        
        return this.VectorToVector(vectorA, vectorB, elemwiseOp)
    }
    static AreOrthogonal(vectorA : IVector, vectorB : IVector) : boolean {
        if (vectorA.GetRank() !== vectorB.GetRank()) {
            return false
        }
        throw "Not done implementing this"
    }  
}
