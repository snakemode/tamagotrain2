import { problems } from "../Config";
import Problem from "./Problem";
import Mouse from "./Mouse";

const cfg = problems.trash;

export default class Trash extends Problem {
  public spawnedMouse: boolean;

  constructor(x: number, y: number) {
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
