
export interface IVector {
    AddScalar(scalarValue : number) : IVector
    AsArray() : Array<number>
    Copy() : IVector
    DivideByScalar(scalarValue : number) : IVector
    GetRank() : number
    MultiplyScalar(scalarValue : number) : IVector
    PerformMapping(elementwiseOperation : (element : number) => number ) : void
    SubtractScalar(scalarValue : number) : IVector
}

export class Vector implements IVector {
    private _innerArray: Array<number>
    constructor(startVal: Array<number>) {
        this._innerArray = startVal
    }
    AsArray(): number[] {
        return this._innerArray
    }    
    GetRank() : number {
        return this.AsArray().size()
    }
    PerformMapping(
        elementwiseOperation : 
        (element : number, index : number, referenceArray : readonly number[]) => number
        ) : void {
        let innerArrayMemoized = this._innerArray.copy()

        this._innerArray = innerArrayMemoized.map(elementwiseOperation)
    }
    AddScalar(scalarValue : number) : IVector {
        
        this.PerformMapping(( elementValue : number ) => {
            return elementValue + scalarValue
        })
        return this
    }
    MultiplyScalar(scalarValue : number) : IVector {
        
        this.PerformMapping(( elementValue : number ) => {
            return elementValue * scalarValue
        })
        return this
    }
    DivideByScalar(scalarValue : number) : IVector {
        
        this.PerformMapping(( elementValue : number ) => {
            return elementValue / scalarValue
        })
        return this
    }
    SubtractScalar(scalarValue : number) : IVector {
        
        this.PerformMapping(( elementValue : number ) => {
            return elementValue - scalarValue
        })
        return this
    }
    Copy() : IVector {
        return new Vector(this.AsArray())
    }

    static VectorToVector(
        vectorA : IVector, 
        vectorB : IVector, 
        operation : (valueA : number, valueB : number) => number) : IVector {
        
        if (vectorA.GetRank() !== vectorB.GetRank()) {
            let msg = "Vectors must be of equal length: vectorA: " + 
                tostring(vectorA.GetRank()) + " vectorB: " + tostring(vectorB.GetRank())
            throw msg
        }
        let newArr = new Array<number>(vectorA.GetRank())

        for (let idx = 0; idx < vectorA.GetRank(); idx++) {
            let valA = vectorA.AsArray()[idx]
            let valB = vectorB.AsArray()[idx]

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
