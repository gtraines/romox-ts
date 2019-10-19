import { IVector, Vector } from './Vectors';

export interface IDimension2Shape extends Vector2 {
    Rows : number
    Columns : number
}

export class Dimension2Shape extends Vector2 implements IDimension2Shape {
    constructor(rows: number, columns: number) {
        super(rows, columns)
    }
    Rows = this.X
    Columns = this.Y
}

export interface IMatrix extends Array<IVector> {
    GetColumns() : Array<IVector>
    GetRows() : Array<IVector>
    GetDeterminant() : IMatrix
    GetDimensions(): IDimension2Shape
    GetLowerUpper(): { Lower: IMatrix, Upper: IMatrix }
    Transpose() : IMatrix
}

export class Matrix extends Array<IVector> implements IMatrix {
    constructor(startingVecs? : IVector[]) {
        super()
        if (startingVecs !== undefined) {
            for (const item of startingVecs) {
                this.push(item.Copy())
            }
        }
    }
    GetDimensions(): IDimension2Shape {
        let rows = this.size()
        let columns = this[0].GetRank()

        return new Dimension2Shape(rows, columns)
    }
    Transpose() : IMatrix {

    }
}

function toMatrix(vecList: Vector[]): Matrix {
    let data = new Array(vecList.size());
    for(let i=0; i<data.size(); i++) {
      data[i] = vecList[i].data.slice();
    }
    return new Matrix(data);
  }

export class Matrix3 extends Array<Vector3> {

    Inverse() : Vector3 {
        return new Vector3(0, 0, 0)
    }
}