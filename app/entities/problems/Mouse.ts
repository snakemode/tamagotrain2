import { problems } from "../../Config";
import Problem from "./Problem";
import { inTargetZone } from "../../traits/Pathfinder";
import { walkNaturally } from "../../traits/Pathfinder";
import Game from "../../Game";
import { Position } from "../IGameEntity";

const cfg = problems.mouse;

class Mouse extends Problem {
  public stepSize: number;
  public offscreen: Position;
  public destination: Position;

  constructor(x: number, y: number) {
    super(x, y);
    this.stepSize = cfg.stepSize;
    this.offscreen = { x: 600, y: 300 };
  }

  public tick(currentGameState: Game) {
    const platform = currentGameState.platform;

    if (!this.destination) {
      this.destination = { x: this.random(0, platform.width), y: this.random(0, platform.height) };
      // Go somewhere random
    }

    if (platform.hygiene >= cfg.leavesWhenHygieneIsAbove || platform.temperature <= cfg.leavesWhenTemperatureIsBelow) {
      this.leave(); // Too clean or too cold! going away.
    }

    walkNaturally(this, this.destination, this.stepSize);

    if (inTargetZone(this, this.offscreen, this.stepSize)) {
      this.completed = true; // They left!
    } else if (inTargetZone(this, this.destination, this.stepSize)) {
      this.destination = null;
    }
  }

  private leave() {
    this.destination = this.offscreen;
  }

  public onCompletion(currentGameState: Game) {
    currentGameState.platform.hygiene += cfg.hygieneChangeWhenMouseLeaves;
  }
}

export default Mouse