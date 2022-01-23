import { game } from "./Config";
import Platform from "./entities/Platform";
import buffs from "./buffs";
import { ITickable } from "./traits/ITickable";

const cfg = game;
const nothing = async () => { };

export default class Game {
  public ticks: number;
  public status: string;
  public platform: Platform;
  public queuedActions: any[];
  public onGameEnd: (state: Game) => void;

  private tickInterval: NodeJS.Timer;

  public gameover: { gameover: boolean; message: string; conditionId: number; };
  public gameovermsg: string;

  constructor() {
    this.init();
  }

  public init() {
    this.ticks = 0;
    this.status = "inactive";
    this.platform = new Platform();
    this.queuedActions = [];
    this.onGameEnd = nothing;
  }

  public async start(options: { onGameStart: any; onGameEnd: any; }) {
    this.init();

    const onStart = options.onGameStart || nothing;
    this.onGameEnd = options.onGameEnd || nothing;
    this.status = "active";

    await onStart();

    this.tickInterval = setInterval(() => {
      this.tick();
    }, 1000 / cfg.ticksPerSecond);
  }

  public stop(showGameOver = true) {
    clearInterval(this.tickInterval);
    this.status = showGameOver ? "ended" : "inactive";
    this.onGameEnd(this);
  }

  public tick() {
    this.ticks++;

    console.log("🕹 Game tick", this.ticks, "Status", this.status, "Queued Actions", this.queuedActions.length);

    const gameOverCheck = this.isGameOver();
    const { gameover, message } = gameOverCheck;

    if (gameover) {
      this.gameover = gameOverCheck;
      this.gameovermsg = message;
      console.log("☠ Game ended");
      this.stop();
      return;
    }

    // handle user input actions    
    while (this.queuedActions.length > 0) {
      const action = this.queuedActions.shift();
      const handler = this.createBuff(action.key);
      this.platform.buffs.push(handler);
    }

    this.platform.tick(this);
  }

  private createBuff(name: string): ITickable {
    try {
      return new buffs[name]();
    } catch (ex) {
      throw "Could not find handler called " + name;
    }
  }

  private isGameOver() {
    const failureConditions = [
      { condition: (g: Game) => (g.platform.temperature >= cfg.failureConditions.tooHot), message: `It's too hot!<br>Score: ${this.ticks}` },
      { condition: (g: Game) => (g.platform.temperature <= cfg.failureConditions.tooCold), message: `It's too cold!<br>Score: ${this.ticks}` },
      { condition: (g: Game) => (g.platform.hygiene <= cfg.failureConditions.tooDirty), message: `It's too disgusting!<br>Score: ${this.ticks}` },
      { condition: (g: Game) => (g.platform.contents.length >= g.platform.capacity), message: `Your platforms are too full!<br>Score: ${this.ticks}` }
    ];

    for (let [index, conditionEntry] of failureConditions.entries()) {
      if (conditionEntry.condition(this)) {
        return { gameover: true, message: conditionEntry.message, conditionId: index };
      }
    }

    return { gameover: false, message: "", conditionId: -1 };
  }

  public queueAction(key: string) {
    if (this.queuedActions.length >= cfg.actionQueueCap) return;
    this.queuedActions.push({ key: key });
  }

  public registerEvent(ablyMessage: any) {
    this.platform.unprocessedMessages.push(ablyMessage);
  }
}
