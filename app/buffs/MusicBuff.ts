import { buffs } from "../Config";
import Traveller from "../entities/Traveller";
import Game from "../Game";
import { ITickable } from "../traits/ITickable";
const cfg = buffs.music;

export default class MusicBuff implements ITickable {
  public ticks: number;
  public completed: boolean;

  constructor() {
    console.log("🎶 MusicBuff()");
    this.ticks = 0;
    this.completed = false;
  }

  public tick(currentGameState: Game) {
    if (this.ticks == cfg.buffLengthInTicks) {
      this.completed = true;
    }
  }

  public onCompletion(currentGameState: Game) {
    this.charmMice(currentGameState.platform);
    for (const entity of currentGameState.platform.contents.filter(c => c.constructor.name == "Traveller")) {
      const traveller = entity as Traveller;
      traveller.isPassedOut = false;
    }
  }

  private charmMice(platform) {
    console.log("Charming all the mice! 🐭🐭🐁🐁");
    const mice = platform.contents.filter(e => e.constructor.name === "Mouse");
    for (const mouse of mice) {
      mouse.leave(platform, 15);
    }
  }

}
