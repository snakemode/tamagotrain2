import { problems } from "../Config";
import Problem from "./Problem";
import Mouse from "./Mouse";
import Game from "../Game";

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

    // Spawn mouse if too trashy
    const random = this.random();

    if (!this.spawnedMouse && platform.hygiene <= cfg.chanceOfMouseWhenLessThanHygiene && random <= cfg.chanceOfMousePercent) {
      platform.contents.push(new Mouse(this.x, this.y));
      this.spawnedMouse = true;
    }
  }

  onCompletion(currentGameState: Game) {
  }
}
