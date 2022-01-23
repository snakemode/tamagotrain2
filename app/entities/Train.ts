import { entities, game } from "../Config";
import Game from "../Game";
import { ITickable } from "../traits/ITickable";
import { uuidv4 } from "../utils";
import Traveller from "./Traveller";

const cfg = entities.train;

export default class Train implements ITickable {
  public id: string;
  public ticks: number;
  public hasTicked: boolean;
  public doorState: string;
  public closeDoorsAtTick: number;

  constructor() {
    this.id = uuidv4();
    this.ticks = 0;
    this.hasTicked = false;
    this.doorState = "closed";
    this.closeDoorsAtTick = cfg.doorsCloseAtTick;

    console.log("🚂 Train(id=" + this.id + ")");
  }

  public setDepartureTimeInMs(departureTimeInMs: number) {
    const departureTimeInSeconds = (departureTimeInMs / 1000);
    const desiredTickForDoorClose = Math.floor(departureTimeInSeconds / game.ticksPerSecond) - 2;
    this.closeDoorsAtTick = desiredTickForDoorClose;

    console.log("Train will close doors at Train Tick: ", this.closeDoorsAtTick);
  }

  public tick(currentGameState: Game) {
    const platform = currentGameState.platform;

    platform.temperature += cfg.temperatureChangePerTick;

    if (this.ticks == 0) {
      this.doorState = "open";
    }

    if (this.ticks >= this.closeDoorsAtTick) {
      this.doorState = "closed";
    }

    if (this.ticks >= cfg.spawnPassengersFromTick && this.ticks <= cfg.doorsCloseAtTick) {
      for (let i = 0; i < cfg.spawnPassengersPerTick; i++) {
        platform.contents.push(new Traveller());
      }
    }

    this.hasTicked = true;
  }
}
