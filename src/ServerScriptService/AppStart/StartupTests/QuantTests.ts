import { Vector, IVector } from '../../../ReplicatedStorage/ToughS/StandardLib/Quantico/Vectors';
import { ITestClass, TestClassBase } from './TestClassBase';


export class QuantTests extends TestClassBase implements ITestClass {
    ClassName = "QuantTests"
    constructor() {
        super()

        this.AddVectorTests()
    }

    AddVectorTests() : void {
        this.VectorAdditionTests()
        this.AddScalarMultiplicationTests()
        this.DotProductTests()
    }

    VectorAdditionTests() : void {
        let firstOne = () => {
            let vectorX = new Vector([3, 4])
            let vectorY = new Vector([0, 2])

            let outputVec = Vector.AddVectors(vectorX, vectorY)
            assert(outputVec.AsArray()[0] === 3, "Expected 3, got: " + tostring(outputVec.AsArray()[0]))
            assert(outputVec.AsArray()[1] === 6, "Expected 6, got: " + tostring(outputVec.AsArray()[1]))

            return true
        }
        
        this.Tests.push(firstOne)
    }

    AddScalarMultiplicationTests() : void {
        let firstOne = () => {
            assert(true)
        }
        
    }

    DotProductTests() : void {
        let firstOne = () => {
            assert(true)
        }
        
    }
}
