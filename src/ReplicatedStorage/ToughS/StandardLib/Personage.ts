import { IGameModel, GameModel } from '../ComponentModel/FundamentalTypes';

export interface IPersonage extends IGameModel{

}

export class Personage extends GameModel implements IPersonage {
    
}