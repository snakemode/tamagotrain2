import { problems } from "../../Config";
import Problem from "./Problem";
import Mouse from "./Mouse";
import Game from "../../Game";

const cfg = problems.trash;

export default class Trash extends Problem {
  public spawnedMouse: boolean;

  constructor(x: number, y: number) {
    super(x, y);
    this.spawnedMouse = false;
  }

  public tick(currentGameState: Game) {
    const platform = currentGameState.platform;

    platform.hygiene += cfg.hygieneChangePerTick;

    if (this.spawnedMouse) {
      // Trash can only spawn one mouse per instance.
      return;
    }

    if (platform.hygiene > cfg.chanceOfMouseWhenLessThanHygiene) {
      // If platform hygiene is ok, don't try to spawn mouse.
      return;
    }

    // Roll dice to spawn mouse...
    if (this.random() <= cfg.chanceOfMousePercent) {
      platform.contents.push(new Mouse(this.x, this.y));
      this.spawnedMouse = true;
    }
  }
}
