import { uuidv4, rand } from "../utils";

export default class Problem {
  public id: string;
  public ticks: number;
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.id = uuidv4();
    this.ticks = 0;
    this.x = x;
    this.y = y;
    console.log("❗ " + this.constructor.name + "(id=" + this.id + ")");
  }

  protected random(min: number = 0, max: number = 100) {
    return rand(min, max);
  }
}
