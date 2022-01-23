import Train from "./Train";
import { entities } from "../Config";
import { Position } from "../types";
const cfg = entities.platform;

export default class Platform {
  public id: any;
  public ticks: number;
  public width: number;
  public height: number;

  public capacity: number;
  public temperature: number;
  public hygiene: number;

  public train: any;
  public hasTrain: boolean;
  public contents: any[];
  public buffs: any[];

  public unprocessedMessages: any[];

  public spawnPoints: SpawnPoint[];
  public exits: Position[];

  constructor(id: string) {
    this.id = id;
    this.ticks = 0;
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
      { x: 120, y: -25, give: 5 },
      { x: 350, y: -25, give: 5 }
    ];

    this.exits = [
      { x: 0, y: 180 },
      // { x: 500,  y: 200 }
    ];
  }

  public tick() {
    this.ticks++;

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
          this.train.completed = true;
          this.complete(this.train);
        }
        this.hasTrain = false;
        this.train = null;
        console.log("🚆 Removed train.");
      }
    }

    let tickables = [this.train, ...this.contents, ...this.buffs];

    // console.log("Ticking:", tickables);
    // console.log("Ticking " + tickables.length + " items.");

    for (let item of tickables) {
      if (!item) {
        continue;
      }

      if (item["tick"]) {
        item.tick(this);
      }

      this.complete(item);
    }

    this.buffs = this.buffs.filter(b => !b.completed);
    this.contents = this.contents.filter(b => !b.completed);
    this.capacity = this.capacity <= 0 ? 0 : this.capacity;
    this.hygiene = this.hygiene <= cfg.hygieneFloor ? cfg.hygieneFloor : this.hygiene;
    this.hygiene = this.hygiene > cfg.hygieneCap ? cfg.hygieneCap : this.hygiene;
  }

  complete(i) {
    if (!i.completed) {
      return;
    }

    console.log("✅ Completed", i);

    if (i["onCompletion"]) {
      i.onCompletion(this);
    }
  }
}

interface SpawnPoint extends Position {
  give: number
}