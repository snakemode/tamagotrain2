import { buffs } from "../Config";
import Game from "../Game";
import Trash from "../problems/Trash";
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

  private removeOneTrash(platform) {
    const allTrash = platform.contents.filter(e => e.constructor.name === "Trash");
    if (allTrash.length === 0) {
      return;
    }

    platform.contents = platform.contents.filter((item: Trash) => item !== allTrash[0]);
    console.log("Removed an item of trash 🚮");
  }
}
