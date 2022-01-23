import { entities } from "../Config";
import { rand, uuidv4 } from "../utils";
import { walkNaturally } from "../traits/Pathfinder";
import Trash from "../problems/Trash";
import Game from "../Game";
import { ITickable } from "../traits/ITickable";

const cfg = entities.traveller;

export default class Traveller implements ITickable {
  public id: string;
  public ticks: number;
  public ticksFromExit: number;
  public completed: boolean;
  public droppedTrash: boolean;
  public isPassedOut: boolean;
  public isDisplayed: boolean;
  public dancing: boolean;
  public selectedExit: any;
  public x: number;
  public y: number;

  constructor() {
    this.id = uuidv4();
    this.ticks = 0;
    this.ticksFromExit = cfg.startValues.ticksFromExit;

    this.completed = false;
    this.droppedTrash = false;
    this.isPassedOut = false;
    this.isDisplayed = false;
    this.dancing = false;

    console.log("🕺 Traveller(id=" + this.id + ")");
  }

  tick(currentGameState: Game) {
    const platform = currentGameState.platform;

    if (!this.selectedExit) {
      const exitIndex = rand(0, platform.exits.length);
      this.selectedExit = platform.exits[exitIndex];
    }

    if (this.ticksFromExit == 0) {
      platform.temperature += cfg.temperatureChangeOnCompletion;
      this.completed = true;

      console.log("🚪 Traveller(id=" + this.id + ") reached exit");
      return;
    }

    this.dancing = platform.buffs.filter(x => x.constructor.name == "MusicBuff").length > 0;
    platform.temperature += cfg.temperatureChangePerTick;

    if (this.dancing || this.isPassedOut) {
      return;
    }

    walkNaturally(this, this.selectedExit, cfg.stepSize);
    this.ticksFromExit--;

    const random = this.random();

    // Am I gonna drop trash? 
    if (!this.droppedTrash && random <= cfg.dropTrashPercentageChance) {
      platform.contents.push(new Trash(this.x, this.y));
      this.droppedTrash = true;
      return;
    }

    // Maybe I'm going to pass out?
    if (!this.isPassedOut && platform.hygiene <= cfg.chanceOfPassingOutWhenHygieneLessThan && random <= cfg.passOutPercentageChance) {
      this.isPassedOut = true;
      console.log("🤒 Traveller(id=" + this.id + ") passed out.");
      return;
    }
  }

  random() { return rand(0, 100); }
}
