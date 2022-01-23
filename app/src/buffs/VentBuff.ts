import { buffs } from "../Config";
import Game from "../Game";
import { ITickable } from "../traits/ITickable";
const cfg = buffs.vent;

export default class VentBuff implements ITickable {
  public ticks: number;
  public completed: boolean;

  constructor() {
    console.log("🌬 VentBuff()");
    this.ticks = 0;
    this.completed = false;
  }

  public tick(currentGameState: Game) {
    currentGameState.platform.temperature += cfg.temperatureChangePerTick;
    currentGameState.platform.hygiene += cfg.hygieneChangePerTick;

    if (this.ticks == cfg.buffLengthInTicks) {
      this.completed = true;
    }
  }
}
