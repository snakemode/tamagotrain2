import { buffs } from "../Config";
const cfg = buffs.music;

export default class MusicBuff {
  public ticks: number;
  public completed: boolean;

  constructor() {
    console.log("🎶 MusicBuff()");
    this.ticks = cfg.buffLengthInTicks;
    this.completed = false;
  }

  public tick(platform) {
    this.ticks--;
    if (this.ticks == 0) {
      this.completed = true;
    }
  }

  public onCompletion(platform) {
    this.charmMice(platform);
    for (const traveller of platform.contents.filter(c => c.constructor.name == "Traveller")) {
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
