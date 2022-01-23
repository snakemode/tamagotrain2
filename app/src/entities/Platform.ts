import Train from "./Train";
import { entities } from "../Config";
import { Position, TrainEvent } from "../types";
import { ITickable } from "../traits/ITickable";
import Game from "../Game";
import { IGameEntity } from "./IGameEntity";
const cfg = entities.platform;

export default class Platform implements ITickable {
  public ticks: number;
  public width: number;
  public height: number;

  public capacity: number;
  public temperature: number;
  public hygiene: number;

  public train: Train;
  public hasTrain: boolean;
  public contents: IGameEntity[];
  public buffs: ITickable[];

  public unprocessedMessages: TrainEvent[];

  public spawnPoints: Position[];
  public exits: Position[];

  private get tickables(): ITickable[] {
    return [this.train, ...this.contents, ...this.buffs].filter(x => x !== null && x["tick"]);
  }

  constructor() {
    this.width = 500;
    this.height = 200;

    this.capacity = cfg.startValues.capacity;
    this.temperature = cfg.startValues.temperature;
    this.hygiene = cfg.startValues.hygiene;

    this.train = null;
    this.hasTrain = false;
    this.contents = [];
    this.buffs = [];

    this.unprocessedMessages = [];
    this.spawnPoints = [
      { x: 120, y: -25 },
      { x: 350, y: -25 }
    ];

    this.exits = [
      { x: 0, y: 180 }
    ];
  }

  public tick(currentGameState: Game) {
    this.ticks = currentGameState.ticks;

    this.processTrainArrivalsAndDepartures(currentGameState);

    for (let item of this.tickables) {
      item.ticks++;
      item.tick(currentGameState);

      if (item.completed) {
        item.onCompletion?.(currentGameState);
      }
    }

    this.buffs = this.buffs.filter(b => !b.completed);
    this.contents = this.contents.filter(b => !b.completed);
    this.capacity = this.capacity <= 0 ? 0 : this.capacity;
    this.hygiene = this.hygiene <= cfg.hygieneFloor ? cfg.hygieneFloor : this.hygiene;
    this.hygiene = this.hygiene > cfg.hygieneCap ? cfg.hygieneCap : this.hygiene;
  }

  private processTrainArrivalsAndDepartures(currentGameState: Game) {
    while (this.unprocessedMessages.length > 0) {
      const msg = this.unprocessedMessages.shift(); // FIFO

      console.log("✉ Message:", msg);

      if (msg.arrived) {
        this.hasTrain = true;
        this.train = new Train();

        if (msg.departsInMs) {
          this.train.setDepartureTimeInMs(msg.departsInMs);
        }
      }

      if (msg.departed) {
        if (this.train) {
          this.train.onCompletion(currentGameState);
        }
        this.hasTrain = false;
        this.train = null;
        console.log("🚆 Removed train.");
      }
    }
  }
}