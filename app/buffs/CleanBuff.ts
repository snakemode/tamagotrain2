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

    this.removeOneTrash(currentGameState);

    if (this.ticks == cfg.buffLengthInTicks) {
      this.completed = true;
    }
  }

  private removeOneTrash(game: Game) {
    const allTrash = game.platform.contents.filter(e => e.constructor.name === "Trash");
    if (allTrash.length === 0) {
      return;
    }

    allTrash[0].completed = true;
    console.log("Removed an item of trash 🚮");
  }
}
