import { problems } from "../Config";
const cfg = problems.trash;
import Problem from "./Problem";
import Mouse from "./Mouse";

class Trash extends Problem {
  constructor(x, y) {
    super(x, y);
    this.spawnedMouse = false;
  }

  tick(platform) {

    platform.hygiene += cfg.hygieneChangePerTick;

    // Spawn mouse if too trashy
    const random = this.random();

    if (!this.spawnedMouse && platform.hygiene <= cfg.chanceOfMouseWhenLessThanHygiene && random <= cfg.chanceOfMousePercent) {
      platform.contents.push(new Mouse(this.x, this.y));
      this.spawnedMouse = true;
    }

    this.ticks++;
  }

  onCompletion(platform) {
  }
}

export default Trash;