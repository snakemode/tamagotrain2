import { uuidv4, rand } from "../utils";

class Problem {
  constructor(x, y) {
    this.id = uuidv4();
    this.ticks = 0;
    this.x = x;
    this.y = y;
    console.log("❗ " + this.constructor.name + "(id=" + this.id + ")");
  }

  random(min, max) {
    min = min || 0;
    max = max || 100;
    return rand(min, max);
  }
}

export default Problem;