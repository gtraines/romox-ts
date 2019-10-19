export class Analytics { 

    static GetLogisticFunction2D(maximumYValue : number, 
        curveSteepnessCoefficient : number, 
        bias : number) : (x: number) => number {
        
            let fn = (x: number) => {
            return maximumYValue/(
                1.0 + math.exp(-1.0 *(curveSteepnessCoefficient * (x + bias)))
                )
        }
        return fn
    }
    static GetStandardLogisticFunction(curveSteepnessCoefficient : number, bias : number) : (x: number) => number {
        let fn = this.GetLogisticFunction2D(1.0, curveSteepnessCoefficient, bias)
        return fn
    }
}