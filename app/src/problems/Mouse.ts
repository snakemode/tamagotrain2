import { problems } from "../Config";
const cfg = problems.mouse;
import Problem from "./Problem";
import { inTargetZone } from "../traits/Pathfinder";
import { walkNaturally } from "../traits/Pathfinder";
import { Position } from "../types";

class Mouse extends Problem {
  public stepSize: number;
  public offscreen: Position;
  public destination: Position;
  public completed: boolean;

  constructor(x, y) {
    super(x, y);
    this.stepSize = cfg.stepSize;
    this.offscreen = { x: 600, y: 300 };
  }

  public tick(platform) {

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

    this.ticks++;
  }

  private leave() {
    this.destination = this.offscreen;
  }

  public onCompletion(platform) {
    platform.hygiene += cfg.hygieneChangeWhenMouseLeaves;
  }
}

export default Mouse