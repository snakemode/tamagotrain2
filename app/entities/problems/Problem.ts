import Game from "../../Game";
import { ITickable } from "../../traits/ITickable";
import { IGameEntity } from "../IGameEntity";
import { uuidv4, rand } from "../../utils";

export default abstract class Problem implements ITickable, IGameEntity {
  public id: string;
  public ticks: number;

  public x: number;
  public y: number;
  public isDisplayed: boolean;
  public completed: boolean;

  constructor(x: number, y: number) {    
    this.id = uuidv4();
    this.ticks = 0;
    this.x = x;
    this.y = y;

    console.log(`❗ ${this.constructor.name}(id=${this.id})`);
  }

  abstract tick(currentGameState: Game): void;

  protected random(min: number = 0, max: number = 100) {
    return rand(min, max);
  }
}
