
export interface ITestClass {
    ClassName : string
    Tests : Array<() => boolean>
    RunAllTests() : boolean
}

export abstract class TestClassBase implements ITestClass {
    abstract ClassName : string
    Tests : Array<() => boolean>
    constructor() {
        this.Tests = new Array<() => boolean>()
    }
    RunAllTests(): boolean {
        let allSuccess = true
        for (let idx = 0; idx < this.Tests.size(); idx++) {
            let testResult = false
            let pCallStatus = pcall(() => {
                testResult = this.Tests[idx]()
            })

            if (!testResult) {
                warn("TEST FAILED: ", tostring(idx))
                allSuccess = false
            }
            if (pCallStatus[0] === false) {
                warn("TEST FAILED: ", tostring(idx), "; ", pCallStatus[1])
                allSuccess = false
            }
        }

        return allSuccess
    }
}
