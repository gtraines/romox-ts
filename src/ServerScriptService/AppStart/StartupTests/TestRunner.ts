import { TestClassBase } from './TestClassBase';
import { QuantTests } from './QuantTests';

export class TestRunner {
    static TestClasses : Array<TestClassBase>
    static AddTestClasses() : void {
        this.TestClasses = new Array<TestClassBase>()
        this.TestClasses.push(new QuantTests())
    }
    static RunTests() : boolean {
        this.AddTestClasses()

        let allSuccess = true

        for (let idx = 0; idx < this.TestClasses.size(); idx++) {
            let testResults = false
            let classInstance = this.TestClasses[idx]
            let pCallStatus = pcall(() => {
                testResults = classInstance.RunAllTests()
            })

            if (!testResults) {
                warn("TEST CLASS FAILED: ", classInstance.ClassName)
                allSuccess = false
            }
            if (pCallStatus[0] === false) {
                warn("TEST FAILED: ", classInstance.ClassName, "; ", pCallStatus[1])
                allSuccess = false
            }
        }
        return allSuccess

    }
}