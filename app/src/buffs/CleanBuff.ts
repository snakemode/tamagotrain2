import { buffs } from "../Config";
import Game from "../Game";
import { ITickable } from "../traits/ITickable";
const cfg = buffs.clean;

export default class CleanBuff implements ITickable {
  public ticks: number;
  public completed: boolean;

  constructor() {
    console.log("🧼 CleanBuff()");
    this.ticks = 0;
    this.completed = false;
  }

  public tick(currentGameState: Game) {
    currentGameState.platform.hygiene += cfg.hygieneChangePerTick;

    this.removeOneTrash(currentGameState.platform);

    if (this.ticks == cfg.buffLengthInTicks) {
      this.completed = true;
    }
  }

  removeOneTrash(platform) {
    for (let index in platform.contents) {
      const entity = platform.contents[index];
      if (entity.constructor.name === "Trash") {
        platform.contents = platform.contents.filter(item => item !== entity);

        console.log("Removed an item of trash 🚮");
        return;
      }
    }
  }
}
